"""Content Generation Pipeline — generates articles via local LLM (Ollama).

Takes pending keywords → picks appropriate content template → generates
article → saves to DB → runs SEO post-processing.

Designed to run as a batch cron job (e.g., 7 articles every Sunday).
"""

import json
import re
import urllib.request
import urllib.parse
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Optional

import yaml
from content_db import (
    init_db, get_pending_keywords, insert_article,
    mark_keyword_status, publish_article
)


# ── Config ──────────────────────────────────────────────────────────

def load_config():
    config_path = Path(__file__).parent.parent / "config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)


CONFIG = load_config()
LLM_ENDPOINT = CONFIG["pipeline"]["llm"]["endpoint"]
LLM_MODEL = CONFIG["pipeline"]["llm"]["model"]
LLM_TEMP = CONFIG["pipeline"]["llm"]["temperature"]
LLM_MAX_TOKENS = CONFIG["pipeline"]["llm"]["max_tokens"]
SITE_CONFIG = CONFIG["site"]
PERSONA = SITE_CONFIG["persona"]


# ── Content type detection ──────────────────────────────────────────

def detect_content_type(keyword: str) -> str:
    """Choose the best content format based on keyword intent."""
    kw = keyword.lower()

    # Comparison
    if " vs " in kw or "versus" in kw or "or" in kw:
        return "comparison"

    # Best-of / roundup
    if kw.startswith("best") or kw.startswith("top") or "best " in kw:
        return "roundup"

    # How-to
    if kw.startswith("how") or kw.startswith("how to") or "tutorial" in kw:
        return "guide"

    # Listicle
    if ("tips" in kw or "ways to" in kw or "things" in kw or
        "ideas" in kw or "hacks" in kw):
        return "listicle"

    # Product review
    if "review" in kw or "vs " in kw:
        return "review"

    return "guide"


# ── Generate article content ───────────────────────────────────────

def call_llm(prompt: str) -> Optional[str]:
    """Call Ollama generate endpoint. Returns response text or None."""
    body = json.dumps({
        "model": LLM_MODEL,
        "prompt": prompt,
        "stream": False,
        "temperature": LLM_TEMP,
        "max_tokens": LLM_MAX_TOKENS,
    }).encode()

    req = urllib.request.Request(
        f"{LLM_ENDPOINT}/api/generate",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            data = json.loads(resp.read())
            return data.get("response", "")
    except Exception as e:
        print(f"[ERROR] LLM call failed: {e}")
        return None


def build_system_prompt() -> str:
    """Build the system-level persona prompt for the LLM."""
    return f"""You are {PERSONA['name']}, a blogger with {PERSONA['expertise']}.
Your tone is: {PERSONA['tone']}.
Your audience is: {PERSONA['audience']}.

WRITING RULES:
- Write in a practical, helpful tone. Not salesy, not academic.
- Use short paragraphs (2-4 sentences max). Nobody reads walls of text.
- Include specific product names, prices, and practical details.
- Write naturally — like you're recommending something to a colleague.
- Use "you" and "your" (second person) throughout.
- Always include a clear CTA at the end.
- Do NOT use markdown headings in the body (will be added by us).
- Write in clean paragraphs, no bullet lists (will be formatted by us).
- Keep paragraphs short.
- IMPORTANT: Output only the article body text, no title, no meta description, no extra commentary.
"""


def generate_roundup(keyword: str) -> tuple[str, str, str, list]:
    """
    Generate a "Best X for Y" roundup article.
    Returns: (title, excerpt, content, affiliate_links)
    """
    prompt = f"""{build_system_prompt()}

Write a detailed roundup article for the keyword: "{keyword}"

Structure:
1. Opening paragraph: Why this matters for remote workers/digital nomads
2. List 5-7 specific product recommendations. For EACH:
   - What it is (name, price range)
   - Why it's great for remote work
   - One specific scenario where it excels
   - One honest drawback (builds trust)
3. Quick comparison table summary
4. Final verdict paragraph with personalized recommendation

Make each product recommendation detailed and specific (200-300 words each).
Total article should be 1500-2000 words.

Return ONLY the body text in plain paragraphs. No title, no formatting markers."""

    content = call_llm(prompt)
    if not content:
        return None, None, None, []

    title = f"Best {keyword.title()} in 2025 — Honest Reviews for Remote Workers"
    excerpt = f"Looking for the {keyword}? We tested the top options for remote workers and digital nomads. Our expert guide covers everything you need to know."
    affiliate_links = extract_affiliate_candidates(content)

    return title, excerpt, content, affiliate_links


def generate_comparison(keyword: str) -> tuple[str, str, str, list]:
    """Generate X vs Y comparison article."""
    # Extract the two items being compared
    parts = re.split(r'\s+(?:vs|vs\.|versus|or)\s+', keyword, flags=re.IGNORECASE)
    item_a = parts[0].strip() if len(parts) > 0 else ""
    item_b = parts[1].strip() if len(parts) > 1 else ""

    prompt = f"""{build_system_prompt()}

Write a detailed comparison article for: "{keyword}"
Comparing: {item_a} vs {item_b}

Structure:
1. Opening: Why this comparison matters for remote workers
2. Quick overview of each product/service (2-3 paragraphs each)
3. Head-to-head comparison across key features:
   - Price/value
   - Ease of setup/use
   - Remote work specific features
   - Build quality / reliability
4. Winner picks for different scenarios:
   - "Best for budget-conscious remote workers"
   - "Best for productivity-focused users"
   - "Best overall"
5. Final verdict

Total article: 1500-2000 words. Return ONLY the body text."""

    content = call_llm(prompt)
    if not content:
        return None, None, None, []

    title = f"{item_a.title()} vs {item_b.title()} — Which Is Better for Remote Work?"
    excerpt = f"Can't decide between {item_a} and {item_b}? We break down the key differences, features, pricing, and help you pick the right one for your remote setup."
    affiliate_links = extract_affiliate_candidates(content)

    return title, excerpt, content, affiliate_links


def generate_guide(keyword: str) -> tuple[str, str, str, list]:
    """Generate a how-to guide article."""
    prompt = f"""{build_system_prompt()}

Write a comprehensive guide for the keyword: "{keyword}"

Structure:
1. Opening: Why this matters for remote workers
2. What you'll need (tools, products, prerequisites)
3. Step-by-step instructions (numbered steps, each 3-5 paragraphs)
4. Common mistakes to avoid (builds trust and authority)
5. Pro tips for remote workers / digital nomads
6. Final thoughts

Make it practical and actionable — the reader should be able to follow along.
Total: 1200-1800 words. Return ONLY the body text."""

    content = call_llm(prompt)
    if not content:
        return None, None, None, []

    title = keyword.title() + " — A Complete Guide for Remote Workers"
    excerpt = f"Everything you need to know about {keyword}. Step-by-step instructions, product recommendations, and expert tips for working from home."
    affiliate_links = extract_affiliate_candidates(content)

    return title, excerpt, content, affiliate_links


def generate_listicle(keyword: str) -> tuple[str, str, str, list]:
    """Generate a listicle/tips article."""
    prompt = f"""{build_system_prompt()}

Write a listicle-style article for: "{keyword}"

Structure:
1. Opening hook: Why this matters for remote workers
2. Present 7-10 tips/items. For EACH:
   - Clear tip name
   - Detailed explanation (2-4 paragraphs)
   - Why it matters specifically for remote workers
3. Final tip: "The one thing you should do today"
4. Closing encouragement

Total: 1500-2000 words. Return ONLY the body text."""

    content = call_llm(prompt)
    if not content:
        return None, None, None, []

    title = keyword.title() + " — 7 Expert Tips for Remote Workers"
    excerpt = f"Discover the {keyword}. Our expert guide covers practical tips, product recommendations, and strategies to boost your remote work setup."
    affiliate_links = extract_affiliate_candidates(content)

    return title, excerpt, content, affiliate_links


GENERATORS = {
    "roundup": generate_roundup,
    "comparison": generate_comparison,
    "guide": generate_guide,
    "listicle": generate_listicle,
    "review": generate_roundup,  # Reuse roundup template for reviews
}


# ── Post-processing helpers ─────────────────────────────────────────

def extract_affiliate_candidates(content: str) -> list:
    """
    Heuristically extract product names from content that could be
    linked to Amazon affiliate URLs.
    """
    # Known product patterns: specific brand + product names
    product_patterns = [
        r'(?:the\s+)?([A-Z][a-zA-Z0-9\s]+(?:Headphones|Monitor|Chair|Desk|Keyboard|Mouse|Webcam|Microphone|Lamp|Light|Stand|Hub|Speaker|Backpack|Bag|Case|Mat|Pad|Screen|Camera|Cable|Charger|Adapter|Router|Extender))',
        r'([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){1,3})\s+(?:is|has|comes|offers|features|costs|prices?|retails)',
    ]

    candidates = set()
    for pattern in product_patterns:
        matches = re.findall(pattern, content)
        for m in matches:
            product = m.strip()
            if len(product) > 5 and len(product) < 80:
                candidates.add(product)

    return [{"text": p, "url": f"https://www.amazon.com/s?k={urllib.parse.quote(p)}&tag={CONFIG['site']['monetization']['amazon_tag']}"}
            for p in sorted(candidates)[:8]]


def make_slug(title: str) -> str:
    """Convert a title to a URL-friendly slug."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    return slug[:100]


# ── Main batch generation ──────────────────────────────────────────

def run_content_generation(batch_size: int = None):
    """Generate articles for pending keywords. Called from cron."""
    init_db()

    if batch_size is None:
        batch_size = CONFIG["pipeline"]["articles_per_batch"]

    print("=" * 60)
    print("CONTENT GENERATION PIPELINE")
    print("=" * 60)

    pending = get_pending_keywords(limit=batch_size)
    if not pending:
        print("  No pending keywords. Run keyword_research first.")
        return

    print(f"  Generating {len(pending)} articles...")

    generated = 0
    failed = 0

    for kw in pending:
        keyword = kw["keyword"]
        kw_id = kw["id"]
        content_type = detect_content_type(keyword)

        print(f"\n  [{generated + 1}/{len(pending)}] {content_type}: {keyword}")

        generator = GENERATORS.get(content_type, generate_guide)
        result = generator(keyword)

        if not result or not result[0]:
            print(f"    ✗ FAILED to generate content")
            mark_keyword_status(kw_id, "failed")
            failed += 1
            continue

        title, excerpt, content, affiliate_links = result
        slug = make_slug(title)
        word_count = len(content.split())

        print(f"    ✓ {word_count} words, slug: {slug}")

        # Insert into DB as draft
        insert_article(
            keyword_id=kw_id,
            slug=slug,
            title=title,
            content=content,
            content_type=content_type,
            excerpt=excerpt[:300] if excerpt else "",
            meta_description=SITE_CONFIG["seo"]["description_template"].format(keyword=keyword),
            word_count=word_count,
            schema_json=json.dumps({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title,
                "description": excerpt[:200],
                "author": {"@type": "Person", "name": PERSONA["name"]},
                "datePublished": datetime.utcnow().isoformat() + "Z",
            }),
            affiliate_links=affiliate_links,
        )

        mark_keyword_status(kw_id, "generated")
        generated += 1

    print(f"\n  Batch complete: {generated} generated, {failed} failed")
    print("✓ Content generation done\n")


if __name__ == "__main__":
    import sys
    batch = int(sys.argv[1]) if len(sys.argv) > 1 else None
    run_content_generation(batch)