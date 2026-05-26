"""Affiliate Links Manager — Central configuration for all affiliate programs.

Each affiliate program has:
- A unique slug (for use in article templates)
- Base URL / link construction pattern
- Commission rate (for internal tracking)
- Payout method and threshold
- Status (active or pending signup)

When you sign up for a program, update its status to 'active'
and fill in your affiliate ID/link.
"""

import json
from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class AffiliateProgram:
    slug: str
    name: str
    url_template: str          # Use {tag} or {id} as placeholder
    commission: str            # e.g. "4-10%", "30% recurring"
    payout_method: str         # e.g. "Direct deposit", "Gift card", "PayPal"
    payout_threshold: str      # e.g. "$10", "$50", "No minimum"
    cookie_duration: str       # e.g. "24 hours", "30 days", "90 days"
    signup_url: str            # Where to apply
    status: str = "pending"    # "active" | "pending" | "applied"
    affiliate_id: str = ""     # Your assigned ID after signup


# ── Program definitions ────────────────────────────────────────────

PROGRAMS = [
    # ── Tier 2: SaaS (Recurring revenue) ─────────────────────────

    AffiliateProgram(
        slug="notion",
        name="Notion",
        url_template="https://www.notion.so/?ref={id}",
        commission="$10/mo per referral or 20% first year",
        payout_method="PayPal",
        payout_threshold="$50",
        cookie_duration="30 days",
        signup_url="https://www.notion.so/affiliates",
        status="pending",
        affiliate_id="",
    ),

    AffiliateProgram(
        slug="zapier",
        name="Zapier",
        url_template="https://zapier.com/?ref={id}",
        commission="30% recurring for 24 months",
        payout_method="PayPal",
        payout_threshold="$25",
        cookie_duration="90 days",
        signup_url="https://zapier.com/affiliate/",
        status="pending",
        affiliate_id="",
    ),

    AffiliateProgram(
        slug="calendly",
        name="Calendly",
        url_template="https://calendly.com/?ref={id}",
        commission="30% of first payment + recurring",
        payout_method="PayPal / Direct deposit",
        payout_threshold="$50",
        cookie_duration="30 days",
        signup_url="https://calendly.com/affiliates",
        status="pending",
        affiliate_id="",
    ),

    AffiliateProgram(
        slug="toggl",
        name="Toggl Track",
        url_template="https://toggl.com/track/{id}",
        commission="30% recurring",
        payout_method="PayPal",
        payout_threshold="$50",
        cookie_duration="30 days",
        signup_url="https://toggl.com/affiliate/",
        status="pending",
        affiliate_id="",
    ),

    # ── Tier 3: Services / Digital Nomad ─────────────────────────

    AffiliateProgram(
        slug="nordvpn",
        name="NordVPN",
        url_template="https://go.nordvpn.net/aff_c?offer_id=15&aff_id={id}",
        commission="Up to $120 per sale flat",
        payout_method="PayPal / Wire transfer",
        payout_threshold="$50",
        cookie_duration="30 days",
        signup_url="https://nordvpn.com/affiliate/",
        status="pending",
        affiliate_id="",
    ),

    AffiliateProgram(
        slug="airalo",
        name="Airalo (eSIM)",
        url_template="https://ref.airalo.com/{id}",
        commission="10% recurring",
        payout_method="PayPal",
        payout_threshold="$20",
        cookie_duration="30 days",
        signup_url="https://www.airalo.com/partners",
        status="pending",
        affiliate_id="",
    ),

    AffiliateProgram(
        slug="skillshare",
        name="Skillshare",
        url_template="https://skillshare.com/?ref={id}",
        commission="$5-10 per free trial signup",
        payout_method="PayPal",
        payout_threshold="$10",
        cookie_duration="30 days",
        signup_url="https://www.skillshare.com/affiliates",
        status="pending",
        affiliate_id="",
    ),

    # ── Tier 4: Ad Networks (traffic-dependent) ──────────────────

    AffiliateProgram(
        slug="ezoic",
        name="Ezoic (Ad Network)",
        url_template="",
        commission="Revenue share (display ads)",
        payout_method="PayPal / Direct deposit",
        payout_threshold="$20",
        cookie_duration="N/A",
        signup_url="https://ezoic.com/",
        status="pending",
        affiliate_id="",
    ),

    AffiliateProgram(
        slug="mediavine",
        name="Mediavine (Ad Network)",
        url_template="",
        commission="Revenue share (display ads)",
        payout_method="PayPal / Direct deposit",
        payout_threshold="$25",
        cookie_duration="N/A",
        signup_url="https://www.mediavine.com/",
        status="pending",
        affiliate_id="",
    ),
]


# ── Payout Dashboard ──────────────────────────────────────────────

PAYOUT_METHODS = {
    "amazon": {
        "available": ["Gift card (any amount)", "Direct deposit ($10 min)", "Check ($100 min)"],
        "recommended": "Gift card → Direct deposit once you hit $10",
        "frequency": "Automatically every month (within 60 days of earning)",
        "tax_form": "Amazon sends 1099-MISC if earnings > $600/yr",
    },
    "saas_general": {
        "available": ["PayPal", "Direct deposit", "Wire transfer"],
        "recommended": "PayPal (fastest, lowest threshold)",
        "tax_note": "Track all earnings. Most SaaS pay via PayPal with no 1099 unless > $20,000/yr",
    },
    "ads_general": {
        "available": ["PayPal", "Direct deposit (once threshold met)"],
        "recommended": "Direct deposit (lower fees on large amounts)",
        "threshold": "Ezoic: $20 min. Mediavine: $25 min.",
    },
}


# ── Link builders ─────────────────────────────────────────────────

def amazon_link(asin: str, tag: Optional[str] = None) -> str:
    """Build an Amazon affiliate link for a product ASIN."""
    program = [p for p in PROGRAMS if p.slug == "amazon"][0]
    t = tag or program.affiliate_id
    if not t:
        t = ""  # fallback placeholder
    return f"https://www.amazon.com/dp/{asin}?tag={t}"


def amazon_search_link(query: str, tag: Optional[str] = None) -> str:
    """Build an Amazon search link with affiliate tag."""
    program = [p for p in PROGRAMS if p.slug == "amazon"][0]
    t = tag or program.affiliate_id
    if not t:
        t = ""
    from urllib.parse import quote
    return f"https://www.amazon.com/s?k={quote(query)}&tag={t}"


def program_link(slug: str) -> Optional[str]:
    """Get the link for a specific affiliate program if active."""
    program = next((p for p in PROGRAMS if p.slug == slug), None)
    if not program or not program.affiliate_id:
        return None
    return program.url_template.replace("{id}", program.affiliate_id).replace("{tag}", program.affiliate_id)


# ── Summary ───────────────────────────────────────────────────────

def print_dashboard():
    """Print a readable overview of all programs and their status."""
    print("=" * 70)
    print("  AFFILIATE DASHBOARD — Remote Work Hub")
    print("=" * 70)

    for p in PROGRAMS:
        status_icon = "✓ ACTIVE" if p.status == "active" else "○ PENDING"
        print(f"\n  [{status_icon}] {p.name}")
        print(f"         Commission: {p.commission}")
        print(f"         Payout:     {p.payout_method} (min {p.payout_threshold})")
        print(f"         Cookie:     {p.cookie_duration}")
        if p.affiliate_id:
            print(f"         ID:         {p.affiliate_id}")
        if p.status == "pending":
            print(f"         Sign up:    {p.signup_url}")
        print()

    print("-" * 70)
    print("  RECOMMENDED PAYOUT CONFIG")
    print(f"  Amazon → {PAYOUT_METHODS['amazon']['recommended']}")
    print(f"  SaaS   → {PAYOUT_METHODS['saas_general']['recommended']}")
    print(f"  Ads    → {PAYOUT_METHODS['ads_general']['recommended']}")
    print("=" * 70)


if __name__ == "__main__":
    print_dashboard()