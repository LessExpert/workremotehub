"""Smart Affiliate Link Injector — Inserts relevant affiliate links into articles.

Maps article content_type + keywords to appropriate SaaS affiliate programs.
This runs during SEO post-processing to maximize commission potential.
"""

import json
import re
from typing import Optional

# ── Affiliate link database ───────────────────────────────────────

# Each entry: keyword trigger → affiliate program → full link
# These are activated when you provide your affiliate IDs

AFFILIATE_LIBRARY = {
    "time_tracking": [
        {"name": "Toggl Track", "slug": "toggl", "url_template": "https://toggl.com/track/",
         "trigger_words": ["time tracking", "time tracker", "track time", "productivity tracker", "hours"],
         "commission": "30% recurring"},
    ],
    "scheduling": [
        {"name": "Calendly", "slug": "calendly", "url_template": "https://calendly.com/",
         "trigger_words": ["schedule", "booking", "calendar", "appointment", "meeting scheduler"],
         "commission": "30% + recurring"},
    ],
    "automation": [
        {"name": "Zapier", "slug": "zapier", "url_template": "https://zapier.com/",
         "trigger_words": ["automate", "workflow", "integration", "connect", "automation"],
         "commission": "30% recurring 24mo"},
    ],
    "vpn": [
        {"name": "NordVPN", "slug": "nordvpn", "url_template": "https://nordvpn.com/",
         "trigger_words": ["vpn", "security", "privacy", "encrypt", "secure connection", "wifi security"],
         "commission": "Up to $120/sale"},
    ],
    "learning": [
        {"name": "Skillshare", "slug": "skillshare", "url_template": "https://skillshare.com/",
         "trigger_words": ["learn", "course", "skill", "class", "tutorial", "education"],
         "commission": "$5-10/trial"},
    ],
    "esim": [
        {"name": "Airalo", "slug": "airalo", "url_template": "https://www.airalo.com/",
         "trigger_words": ["esim", "travel data", "international roaming", "mobile data", "sim card"],
         "commission": "10% recurring"},
    ],
}


def detect_affiliate_opportunities(content: str, content_type: str, title: str) -> list[dict]:
    """
    Scan article content for keywords that match affiliate programs.
    Returns list of relevant affiliate recommendations with context.
    """
    combined = (title + " " + content).lower()
    found = []

    for category, programs in AFFILIATE_LIBRARY.items():
        for program in programs:
            matched = [w for w in program["trigger_words"] if w in combined]
            if matched:
                # Score: more matches = more relevant
                score = len(matched)
                found.append({
                    "program": program["name"],
                    "slug": program["slug"],
                    "url": program["url_template"],
                    "score": score,
                    "matched_keywords": matched,
                    "commission": program["commission"],
                })

    # Sort by relevance (most keyword matches first)
    found.sort(key=lambda x: -x["score"])
    return found[:3]  # Max 3 affiliate suggestions per article


def generate_affiliate_snippet(opportunities: list[dict]) -> str:
    """Generate an HTML snippet with affiliate link suggestions."""
    if not opportunities:
        return ""

    lines = ['<div class="affiliate-suggestions">',
             '<p><strong>💡 Recommended Tools:</strong></p>',
             '<ul>']

    for opp in opportunities:
        lines.append(
            f'<li><a href="{opp["url"]}" rel="sponsored" target="_blank" '
            f'class="affiliate-link">{opp["program"]}</a> '
            f'<span style="font-size:0.8rem;color:var(--gray-400);">'
            f'({opp["commission"]})</span></li>'
        )

    lines.append('</ul></div>')
    return "\n".join(lines)


if __name__ == "__main__":
    # Test
    test_content = "The best time tracking tools help you automate your workflow and stay productive. Use a calendar to schedule your day. For security, always use a VPN when working from coffee shops."
    test_title = "Best Productivity Tools for Remote Workers"

    opps = detect_affiliate_opportunities(test_content, "guide", test_title)
    print("Detected affiliate opportunities:")
    for o in opps:
        print(f"  [{o['score']}] {o['program']} → {o['matched_keywords']} ({o['commission']})")

    print("\nGenerated snippet:")
    print(generate_affiliate_snippet(opps))