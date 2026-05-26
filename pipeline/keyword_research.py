"""Keyword Research Pipeline — discovers and scores target keywords.

Strategy: Start from seed keywords → expand via LLM-generated related terms
→ score by (estimated volume / difficulty) → queue for content generation.

Runs autonomously every week via cron.
"""

import json
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from typing import Optional
from pathlib import Path

import yaml

from content_db import init_db, add_keyword, get_pending_keywords


# ── Config ──────────────────────────────────────────────────────────

def load_config():
    config_path = Path(__file__).parent.parent / "config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)


CONFIG = load_config()
SEEDS = CONFIG["pipeline"]["keywords"]["seed_list"]
CLUSTERS = CONFIG["pipeline"]["keywords"]["clusters"]


# ── Keyword expansion via LLM ──────────────────────────────────────

def generate_related_keywords(seeds: list[str], llm_endpoint: str,
                               model: str) -> list[str]:
    """Use local Ollama to brainstorm related long-tail keywords from seeds."""
    prompt = f"""You are a keyword researcher for a website about "Remote Work & Digital Nomad" lifestyle.

Given these seed keywords, generate 30 NEW long-tail keyword phrases that:
1. Have clear search intent (informational or commercial investigation)
2. Are 3-6 words long (long-tail = easier to rank)
3. Are NOT in the seed list provided
4. Cover different angles: product recommendations, how-to guides, comparisons, tips
5. Include some with "[year]" for evergreen content

Seed keywords:
{chr(10).join(f'- {s}' for s in seeds)}

Return ONLY a JSON array of strings, nothing else:
["keyword 1", "keyword 2", ...]
"""

    body = json.dumps({
        "model": model,
        "prompt": prompt,
        "stream": False,
        "temperature": 0.8,
        "max_tokens": 2000,
    }).encode()

    req = urllib.request.Request(
        f"{llm_endpoint}/api/generate",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
            raw = data.get("response", "[]")
            # Extract JSON array from response (handle markdown-wrapped output)
            match = re.search(r'\[.*?\]', raw, re.DOTALL)
            if match:
                keywords = json.loads(match.group())
                return [k.strip().lower() for k in keywords if len(k.strip().split()) >= 2]
    except Exception as e:
        print(f"[WARN] LLM keyword expansion failed: {e}")
        return []

    return []


# ── Assign clusters ─────────────────────────────────────────────────

def assign_cluster(keyword: str) -> Optional[str]:
    """Assign a keyword to a topic cluster based on keyword match."""
    kw_lower = keyword.lower()
    for cluster in CLUSTERS:
        name = cluster["name"]
        cluster_kws = cluster.get("keywords", [])
        if any(ckw in kw_lower for ckw in cluster_kws):
            return name
    return None


# ── Estimate keyword difficulty heuristically ──────────────────────

def estimate_difficulty(keyword: str) -> int:
    """
    Heuristic difficulty score 1-100 without paying for API.
    Higher = harder to rank.
    Factors: keyword length (long-tail easier), brand mentions (harder),
    commercial intent (harder).
    """
    kw_lower = keyword.lower()
    score = 30  # baseline

    # Longer keywords = more specific = easier
    words = kw_lower.split()
    if len(words) >= 5:
        score -= 15
    elif len(words) >= 4:
        score -= 10
    elif len(words) == 2:
        score += 5

    # Commercial investigation terms = harder
    commercial_indicators = ["best", "review", "vs", "cheap", "discount",
                             "price", "cost", "top", "affordable", "coupon"]
    if any(ind in kw_lower for ind in commercial_indicators):
        score += 10

    # Brand mentions = harder (SEO competition)
    brand_indicators = ["amazon", "apple", "google", "microsoft", "zoom",
                        "slack", "notion", "logitech", "sony", "bose"]
    if any(brand in kw_lower for brand in brand_indicators):
        score += 15

    # How-to / guide keywords = easier
    easy_indicators = ["how to", "tips", "guide", "ways to", "what is",
                       "beginner", "simple", "easy", "setup"]
    if any(ind in kw_lower for ind in easy_indicators):
        score -= 10

    return max(1, min(100, score))


# ── Estimate volume (heuristic) ────────────────────────────────────

def estimate_volume(keyword: str) -> int:
    """
    Rough volume estimate 0-10000 without paying for API.
    Used for prioritization only, not actual traffic numbers.
    """
    kw_lower = keyword.lower()
    base = 100

    # Common high-volume terms
    high_vol = ["best", "review", "how to", "top", "vs", "cheap", "near me"]
    if any(hv in kw_lower for hv in high_vol):
        base += 200

    # Shorter = more searches (generally)
    word_count = len(kw_lower.split())
    if word_count <= 3:
        base += 300
    elif word_count <= 5:
        base += 100

    # Product-specific terms
    if any(p in kw_lower for p in ["headphones", "monitor", "chair", "desk",
                                    "webcam", "keyboard", "mouse", "laptop"]):
        base += 400

    return min(base, 10000)


# ── Main research pipeline ─────────────────────────────────────────

def run_keyword_research():
    """Complete keyword research run. Call this from cron."""
    init_db()

    print("=" * 60)
    print("KEYWORD RESEARCH PIPELINE")
    print("=" * 60)

    # Step 1: Add seed keywords to DB
    seeds_added = 0
    for keyword in SEEDS:
        cluster = assign_cluster(keyword)
        if add_keyword(keyword, cluster=cluster, source="seed",
                       volume=estimate_volume(keyword),
                       difficulty=estimate_difficulty(keyword)):
            seeds_added += 1
    print(f"  Seeds added: {seeds_added}")

    # Step 2: Generate related keywords via LLM
    llm_endpoint = CONFIG["pipeline"]["llm"]["endpoint"]
    llm_model = CONFIG["pipeline"]["llm"]["model"]
    related = generate_related_keywords(SEEDS, llm_endpoint, llm_model)
    print(f"  Related keywords from LLM: {len(related)}")

    expanded_added = 0
    for keyword in related:
        cluster = assign_cluster(keyword)
        if add_keyword(keyword, cluster=cluster, source="llm_expansion",
                       volume=estimate_volume(keyword),
                       difficulty=estimate_difficulty(keyword)):
            expanded_added += 1
    print(f"  New from expansion: {expanded_added}")

    # Step 3: Summary
    pending = get_pending_keywords(limit=0)
    print(f"\n  Total pending keywords: {len(pending)}")
    print("✓ Keyword research complete\n")


if __name__ == "__main__":
    run_keyword_research()