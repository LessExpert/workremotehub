"""SEO Post-Processing Pipeline — runs after content generation.

Steps:
1. Auto-interlink articles (link related articles within same cluster)
2. Generate/update sitemap.xml
3. Export generated articles as MDX files for Astro
4. Refresh stale articles (mark for regeneration)
"""

import json
import re
from pathlib import Path
from datetime import datetime
from typing import Optional

import yaml
from content_db import init_db, get_published_articles, get_articles_by_status, get_stale_articles


# ── Config ──────────────────────────────────────────────────────────

def load_config():
    config_path = Path(__file__).parent.parent / "config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)


CONFIG = load_config()
SITE_CONFIG = CONFIG["site"]
SEO_CONFIG = CONFIG["seo"]
SITE_URL = SITE_CONFIG["base_url"].rstrip("/")

# Paths
SITE_CONTENT_DIR = Path(__file__).parent.parent / "site" / "src" / "content" / "articles"
ROOT_DIR = Path(__file__).parent.parent


# ── Step 1: Auto-interlinking ──────────────────────────────────────

def build_article_graph(articles: list[dict]) -> dict:
    """Build keyword → article_id mapping for interlinking."""
    graph = {}
    for a in articles:
        # Extract key terms from title and slug
        slug_words = set(a["slug"].replace("-", " ").split())
        title_words = set(a["title"].lower().split())
        word_pool = slug_words | title_words
        # Remove common stop words
        stop_words = {"the", "a", "an", "in", "of", "for", "and", "to",
                      "is", "it", "on", "that", "this", "with", "at",
                      "from", "by", "or", "as", "be", "are", "was",
                      "best", "top", "vs", "2025", "2024", "review",
                      "guide", "how", "tips", "ultimate", "complete"}
        keywords = [w for w in word_pool if w not in stop_words and len(w) > 3]
        for kw in keywords:
            if kw not in graph:
                graph[kw] = []
            graph[kw].append({
                "id": a["id"],
                "slug": a["slug"],
                "title": a["title"],
            })
    return graph


def auto_interlink(articles: list[dict], graph: dict) -> dict[int, list]:
    """
    For each article, find 3-6 related articles to link to.
    Returns dict[article_id] -> [{"slug": "...", "title": "...", "anchor": "..."}]
    """
    min_links = CONFIG["pipeline"]["interlinking"]["min_links_per_article"]
    max_links = CONFIG["pipeline"]["interlinking"]["max_links_per_article"]
    link_map = {}

    for a in articles:
        candidates = []
        slug_words = set(a["slug"].replace("-", " ").split())
        title_words = set(a["title"].lower().split())
        word_pool = slug_words | title_words

        seen = {a["slug"]}  # Don't link to self
        for word in word_pool:
            if word in graph:
                for candidate in graph[word]:
                    if candidate["slug"] not in seen:
                        # Score: more word overlaps = stronger link
                        c_words = set(candidate["slug"].replace("-", " ").split())
                        overlap = len(word_pool & c_words)
                        candidates.append((overlap, candidate))
                        seen.add(candidate["slug"])

        # Sort by overlap score (highest first), take top N
        candidates.sort(key=lambda x: -x[0])
        selected = candidates[:max_links]

        # Ensure minimum
        if len(selected) < min_links:
            # Fallback: link to any other article
            fallbacks = [{"slug": x["slug"], "title": x["title"]}
                         for x in articles if x["slug"] != a["slug"]]
            for fb in fallbacks:
                if len(selected) >= max_links:
                    break
                if not any(s[1]["slug"] == fb["slug"] for s in selected):
                    selected.append((0, fb))

        links = []
        for score, cand in selected:
            # Create anchor text from the linked article's title
            anchor = cand["title"]
            # Truncate long anchors
            if len(anchor) > 60:
                anchor = anchor[:57] + "..."
            links.append({
                "slug": cand["slug"],
                "title": cand["title"],
                "anchor": anchor,
            })

        link_map[a["id"]] = links

    return link_map


def inject_internal_links(content: str, links: list) -> str:
    """
    Inject internal links into article body at natural break points.
    Inserts after first few paragraphs and before final paragraph.
    """
    if not links:
        return content

    paragraphs = content.strip().split("\n\n")
    if len(paragraphs) < 4:
        return content

    # Insert a "related reads" section after paragraph 3
    related_section = "\n\n**Related:** "
    related_section += " · ".join(
        f"[{l['anchor']}](/{l['slug']})" for l in links[:3]
    )

    paragraphs.insert(3, related_section)

    # If we have more links, add another section toward the end
    if len(links) > 3:
        more_section = "\n\n**Also check out:** "
        more_section += " · ".join(
            f"[{l['anchor']}](/{l['slug']})" for l in links[3:5]
        )
        paragraphs.insert(-1, more_section)

    return "\n\n".join(paragraphs)


# ── Step 2: Export to MDX ──────────────────────────────────────────

def article_to_mdx(article: dict, internal_links: list = None) -> str:
    """Convert a database article row to Astro MDX frontmatter + content."""
    # Schema
    try:
        schema = json.loads(article.get("schema_json", "{}"))
    except (json.JSONDecodeError, TypeError):
        schema = {}

    # Affiliate disclaimer
    disclaimer = (
        "\n\n---\n\n"
        "*Disclosure: Some links in this article are affiliate links. "
        "If you buy through them, we may earn a commission at no extra cost "
        "to you. We only recommend products we genuinely believe in.*"
    )

    # Build frontmatter
    slug = article["slug"]
    title = article["title"]
    excerpt = article.get("excerpt", "") or ""
    published = article.get("published_at") or datetime.utcnow().isoformat()
    content_type = article.get("content_type", "guide")
    word_count = article.get("word_count", 0)

    affiliate_items = []
    try:
        affiliate_items = json.loads(article.get("affiliate_links", "[]"))
    except (json.JSONDecodeError, TypeError):
        pass

    # Build tags from article slug + title keywords
    tags = []
    for w in slug.replace("-", " ").split():
        if len(w) > 3 and w not in ("with", "that", "this", "your"):
            tags.append(w[:20])
    # Dedupe
    tags = list(dict.fromkeys(tags))[:5]

    frontmatter = {
        "title": title,
        "description": excerpt[:200],
        "pubDate": published[:10],
        "slug": slug,
        "contentType": content_type,
        "wordCount": word_count,
        "tags": tags,
        "schema": schema,
        "affiliateLinks": affiliate_items,
        "draft": False,
    }

    # Build content body
    body = article["content"]

    # Inject internal links into body
    if internal_links:
        body = inject_internal_links(body, internal_links)

    # Add affiliate links section at the bottom
    if affiliate_items:
        products_section = "\n\n---\n\n**Products mentioned in this article:**\n\n"
        for item in affiliate_items[:5]:
            products_section += f"- [{item['text']}]({item['url']})\n"
        body += products_section

    body += disclaimer

    # Serialize frontmatter
    fm_lines = ["---"]
    for key, val in frontmatter.items():
        if key == "schema" and val:
            fm_lines.append(f'{key}: {json.dumps(val)}')
        elif key == "affiliateLinks" and val:
            fm_lines.append(f'{key}: {json.dumps(val)}')
        elif key == "tags":
            fm_lines.append(f'tags: {json.dumps(val)}')
        elif isinstance(val, str):
            # Escape any special chars
            escaped = val.replace('"', '\\"')
            fm_lines.append(f'{key}: "{escaped}"')
        elif isinstance(val, bool):
            fm_lines.append(f'{key}: {str(val).lower()}')
        else:
            fm_lines.append(f'{key}: {val}')
    fm_lines.append("---")

    return "\n".join(fm_lines) + "\n\n" + body


def export_to_mdx(article: dict, internal_links: list = None):
    """Write a single article as MDX to the Astro content directory."""
    SITE_CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    mdx_path = SITE_CONTENT_DIR / f"{article['slug']}.mdx"
    content = article_to_mdx(article, internal_links)
    mdx_path.write_text(content, encoding="utf-8")
    print(f"    ✓ Exported: {mdx_path.name}")
    return mdx_path


# ── Step 3: Generate sitemap.xml ───────────────────────────────────

def generate_sitemap(articles: list[dict]) -> str:
    """Generate a sitemap.xml string from published articles."""
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    # Homepage
    lines.append("  <url>")
    lines.append(f"    <loc>{SITE_URL}/</loc>")
    lines.append(f"    <changefreq>daily</changefreq>")
    lines.append(f"    <priority>{SEO_CONFIG['sitemap']['priority']['homepage']}</priority>")
    lines.append("  </url>")

    # Articles
    for a in articles:
        lines.append("  <url>")
        lines.append(f"    <loc>{SITE_URL}/{a['slug']}/</loc>")
        published = (a.get("published_at") or datetime.utcnow().isoformat())[:10]
        lines.append(f"    <lastmod>{published}</lastmod>")
        lines.append(f"    <changefreq>{SEO_CONFIG['sitemap']['changefreq']}</changefreq>")
        lines.append(f"    <priority>{SEO_CONFIG['sitemap']['priority']['articles']}</priority>")
        lines.append("  </url>")

    lines.append("</urlset>")
    return "\n".join(lines)


# ── Main SEO pipeline ──────────────────────────────────────────────

def run_seo_postprocessing():
    """Full SEO post-processing run. Call after content generation."""
    init_db()

    print("=" * 60)
    print("SEO POST-PROCESSING PIPELINE")
    print("=" * 60)

    # Get all articles
    drafts = get_articles_by_status("draft")
    published = get_published_articles()
    all_articles = drafts + published
    print(f"  Processing {len(all_articles)} articles ({len(drafts)} new drafts)")

    if not all_articles:
        print("  No articles to process.")
        return

    # Step 1: Build interlinking graph
    print("\n  [1/3] Building interlinking graph...")
    graph = build_article_graph(all_articles)
    print(f"    {len(graph)} linking keywords in graph")

    # Step 2: Auto-interlink and export drafts
    print("\n  [2/3] Exporting articles to MDX...")
    link_map = auto_interlink(all_articles, graph)
    exported = 0
    for a in drafts:
        links = link_map.get(a["id"], [])
        export_to_mdx(a, links)
        exported += 1
    if not drafts:
        print("    No new drafts to export.")

    # Re-export published articles too (to update interlinks)
    re_exported = 0
    for a in published:
        links = link_map.get(a["id"], [])
        export_to_mdx(a, links)
        re_exported += 1
    print(f"    {exported} new + {re_exported} re-exported = {exported + re_exported} total")

    # Step 3: Generate sitemap
    print("\n  [3/3] Generating sitemap.xml...")
    sitemap = generate_sitemap(published + drafts)
    sitemap_path = ROOT_DIR / "site" / "public" / "sitemap.xml"
    sitemap_path.write_text(sitemap, encoding="utf-8")
    print(f"    ✓ Sitemap: {sitemap_path} ({len(published + drafts)} URLs)")

    print("\n✓ SEO post-processing complete\n")


# ── Stale content check ─────────────────────────────────────────────

def check_stale_content():
    """Identify articles that need refreshing."""
    days = CONFIG["monitoring"]["stale_content_threshold_days"]
    stale = get_stale_articles(days)
    if stale:
        print(f"\n  Stale articles ({len(stale)}):")
        for a in stale:
            print(f"    - {a['title']} (last updated: {a['updated_at']})")
        print(f"  Run 'content_gen.py' to regenerate these.")
    else:
        print("  No stale articles found.")
    return stale


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--stale":
        check_stale_content()
    else:
        run_seo_postprocessing()