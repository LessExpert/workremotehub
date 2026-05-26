#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# setup.sh — Bootstrap the entire SEO Content Hub from scratch
# ═══════════════════════════════════════════════════════════════════
# Usage: bash setup.sh
#
# Does:
#   1. Install Ollama (if not present)
#   2. Pull the LLM model
#   3. Install Python deps
#   4. Install Node deps (Astro)
#   5. Initialize SQLite database
#   6. Run the first batch of keyword research
#   7. Generate initial articles (3 to start)
#   8. Run SEO post-processing
#   9. Print instructions for deployment
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   REMOTE WORK HUB — SEO CONTENT HUB SETUP    ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Check / Install Ollama ──────────────────────────────

echo "[1/8] Checking Ollama..."

if command -v ollama &> /dev/null; then
    echo "  ✓ Ollama CLI found"
else
    echo "  Installing Ollama (Linux)..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "  ✓ Ollama installed"
fi

# Start Ollama if not running
if ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "  Starting Ollama..."
    ollama serve &>/dev/null &
    sleep 3
fi

# ── Step 2: Pull LLM model ──────────────────────────────────────

MODEL=$(grep -A2 'llm:' pipeline/config.py 2>/dev/null || echo "")

# Read model from config.yaml
MODEL_NAME="llama3.2:latest"
if command -v python3 &> /dev/null; then
    MODEL_NAME=$(python3 -c "
import yaml
with open('config.yaml') as f:
    c = yaml.safe_load(f)
print(c['pipeline']['llm']['model'])
" 2>/dev/null || echo "llama3.2:latest")
fi

echo "[2/8] Pulling Ollama model: $MODEL_NAME ..."
ollama pull "$MODEL_NAME" 2>&1 | tail -3
echo "  ✓ Model ready"

# ── Step 3: Python dependencies ─────────────────────────────────

echo "[3/8] Installing Python dependencies..."
pip3 install pyyaml requests 2>&1 | tail -1
echo "  ✓ Python deps installed"

# ── Step 4: Initialize database ─────────────────────────────────

echo "[4/8] Initializing database..."
python3 pipeline/content_db.py
echo "  ✓ Database initialized"

# ── Step 5: Run keyword research ────────────────────────────────

echo "[5/8] Running initial keyword research..."
python3 pipeline/keyword_research.py
echo "  ✓ Keywords seeded"

# ── Step 6: Generate first batch of articles ────────────────────

echo "[6/8] Generating first 3 articles..."
python3 pipeline/content_gen.py 3
echo "  ✓ First batch generated"

# ── Step 7: SEO post-processing ─────────────────────────────────

echo "[7/8] Running SEO post-processing..."
python3 pipeline/seo_postprocess.py
echo "  ✓ SEO pipeline complete"

# ── Step 8: Astro site setup ────────────────────────────────────

echo "[8/8] Setting up Astro site..."
cd site

# Install npm packages
if [ ! -d "node_modules" ]; then
    npm install 2>&1 | tail -3
fi

# Build test
echo "  Testing Astro build..."
if npm run build 2>&1 | tail -1; then
    echo "  ✓ Astro build successful"
else
    echo "  ! Astro build had issues — check npm install"
fi

cd "$SCRIPT_DIR"

# ── Done ─────────────────────────────────────────────────────────

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║              SETUP COMPLETE                   ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  What's next:"
echo ""
echo "  1. Set your domain in these files:"
echo "     • config.yaml          → site.domain, site.base_url"
echo "     • site/src/config.ts   → SITE.url"
echo "     • site/astro.config.mjs → site"
echo "     • cron/monitor.sh      → DOMAIN variable"
echo ""
echo "  2. Set your Amazon affiliate tag:"
echo "     • config.yaml → site.monetization.amazon_tag"
echo "     • site/src/config.ts → AMAZON_TAG"
echo ""
echo "  3. Push to GitHub + connect Cloudflare Pages:"
echo "     • Create repo: github.com/YOU/remote-work-hub"
echo "     • git remote add origin git@github.com:YOU/remote-work-hub.git"
echo "     • git push -u origin main"
echo "     • In Cloudflare Dashboard → Pages → Create new"
echo "     • Connect repo → Framework preset: Astro"
echo "     • Set CF_API_TOKEN and CF_ACCOUNT_ID in GitHub Secrets"
echo ""
echo "  4. Set up cron (automatic generation):"
echo "     • crontab -e"
echo "     • Add: 0 5 */3 * * $PWD/cron/run_pipeline.sh >> $PWD/cron.log 2>&1"
echo "     • Add: 0 8 * * 1 $PWD/cron/monitor.sh"
echo ""
echo "  5. To run the dev server locally:"
echo "     cd site && npm run dev"
echo ""
echo "  6. To manually generate more articles:"
echo "     bash cron/run_pipeline.sh 7"
echo ""