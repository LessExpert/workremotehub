#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# monitor.sh — Periodic health checks for the SEO content hub
# ═══════════════════════════════════════════════════════════
# Run weekly via cron:
#   0 8 * * 1 /home/.../seo-content-hub/cron/monitor.sh
# ═══════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SITE_DIR="$PROJECT_DIR/site"
LOG_FILE="$PROJECT_DIR/monitor.log"

cd "$PROJECT_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "═══════════════ SITE MONITOR ═══════════════"

# ── 1. Check site is live ─────────────────────────────────────────

DOMAIN="workremotehub.com"  # CHANGE to your real domain

log "Checking $DOMAIN ..."
if curl -sf -o /dev/null -w "%{http_code}" "https://$DOMAIN/" 2>/dev/null | grep -q "200\|301\|302"; then
    log "✓ Site is live"
else
    log "✗ Site returned non-200 — check deployment"
fi

# ── 2. Check database health ──────────────────────────────────────

DB_PATH="$PROJECT_DIR/content.db"
if [ -f "$DB_PATH" ]; then
    DB_SIZE=$(stat -c%s "$DB_PATH" 2>/dev/null || stat -f%z "$DB_PATH" 2>/dev/null)
    DB_SIZE_MB=$((DB_SIZE / 1048576))
    log "✓ Database: ${DB_SIZE_MB}MB"

    # Quick stats
    python3 -c "
from pipeline.content_db import init_db, get_stats
init_db()
s = get_stats()
print(f'  Stats: {s[\"published\"]} published, {s[\"total_articles\"]} total, {s[\"pending_keywords\"]} pending keywords, {s[\"total_words_published\"]} words total')
" 2>&1 | tee -a "$LOG_FILE"
else
    log "! Database not found — run initial pipeline"
fi

# ── 3. Check article output directory ─────────────────────────────

COUNT=$(ls -1 "$SITE_DIR/src/content/articles/"*.mdx 2>/dev/null | wc -l)
log "✓ MDX files in content dir: $COUNT"

# ── 4. Check for stale content ───────────────────────────────────

python3 -c "
from pipeline.content_db import init_db, get_stale_articles
init_db()
stale = get_stale_articles(180)
if stale:
    print(f'  ! {len(stale)} articles need refresh:')
    for a in stale:
        print(f'    - {a[\"title\"]} ({a[\"updated_at\"]})')
else:
    print('  ✓ No stale articles')
" 2>&1 | tee -a "$LOG_FILE"

# ── 5. Astro build test ──────────────────────────────────────────

log "Testing Astro build..."
cd "$SITE_DIR"
if npm run build &>/dev/null; then
    log "✓ Astro build succeeds"
else
    log "✗ Astro build FAILED — check site/ directory"
fi

log "═══════════════ MONITOR COMPLETE ═══════════════"
log ""