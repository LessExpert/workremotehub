#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# run_pipeline.sh — Full content pipeline automation script
# ═══════════════════════════════════════════════════════════
# This script runs the entire content pipeline:
#   1. Check Ollama is running
#   2. Run keyword research (expand seed list via LLM)
#   3. Generate N articles for pending keywords
#   4. Run SEO post-processing (interlinking, sitemap, MDX export)
#   5. Commit + push generated content (triggers CI/CD deploy)
#
# Schedule: every 3 days via cron (or more frequently)
# ═══════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PIPELINE_DIR="$PROJECT_DIR/pipeline"
SITE_DIR="$PROJECT_DIR/site"
LOG_FILE="$PROJECT_DIR/pipeline.log"

cd "$PROJECT_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "═══════════════ PIPELINE START ═══════════════"
log "Project: $PROJECT_DIR"

# ── Step 0: Prerequisites ──────────────────────────────────────────

# Check Python
if ! command -v python3 &> /dev/null; then
    log "ERROR: python3 not found"
    exit 1
fi

# Check Ollama is running
if ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
    log "WARNING: Ollama not running at localhost:11434"
    log "Attempting to start Ollama..."
    ollama serve &>/dev/null &
    sleep 3
    if ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
        log "ERROR: Could not reach Ollama. Start it manually: ollama serve"
        exit 1
    fi
fi

log "Ollama: running"

# ── Step 1: Keyword Research ──────────────────────────────────────

log "[1/4] Running keyword research..."
cd "$PIPELINE_DIR"
python3 keyword_research.py 2>&1 | tee -a "$LOG_FILE"
log "Keyword research complete"

# ── Step 2: Content Generation ────────────────────────────────────

BATCH_SIZE="${1:-7}"  # Default to 7 articles per run

log "[2/4] Generating $BATCH_SIZE articles..."
python3 content_gen.py "$BATCH_SIZE" 2>&1 | tee -a "$LOG_FILE"
log "Content generation complete"

# ── Step 3: SEO Post-Processing ───────────────────────────────────

log "[3/4] Running SEO post-processing..."
python3 seo_postprocess.py 2>&1 | tee -a "$LOG_FILE"
log "SEO post-processing complete"

# ── Step 4: Commit & Push ─────────────────────────────────────────

log "[4/4] Committing and pushing to GitHub..."

# Check if there are changes
if git -C "$PROJECT_DIR" status --porcelain | grep -q .; then
    git -C "$PROJECT_DIR" add -A
    git -C "$PROJECT_DIR" commit -m "Auto: content pipeline batch $(date '+%Y-%m-%d')"
    git -C "$PROJECT_DIR" push origin main
    log "Pushed to GitHub — CI/CD will deploy to Cloudflare Pages"
else
    log "No changes to commit"
fi

log "═══════════════ PIPELINE END ═══════════════"
log ""