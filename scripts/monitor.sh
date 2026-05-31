#!/bin/bash
# monitor.sh - health check script for burniqo.com

SITE_URL="https://burniqo.com"
SITE_ROOT="/root/workremotehub/site"
TELEGRAM_CHAT_ID="1645077472"

alert() {
  local msg="$1"
  # Use the hermes send command for Telegram alerts
  /usr/local/lib/hermes-agent/venv/bin/hermes send --to telegram:1645077472 "$msg"
}

# 1️⃣ Site uptime check
echo "Checking site uptime..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
if [[ "$http_code" != "200" ]]; then
  alert "⚠️ Site down (HTTP $http_code)"
fi

# 2️⃣ Sitemap existence & size
if [[ ! -s "$SITE_ROOT/dist/sitemap.xml" ]]; then
  alert "⚠️ Sitemap missing or empty: $SITE_ROOT/dist/sitemap.xml"
fi

# 3️⃣ AdSense script presence on homepage
if ! curl -s "$SITE_URL" | grep -q "adsbygoogle.js"; then
  alert "⚠️ AdSense script not found on homepage"
fi

# 4️⃣ Required pages existence (About, Contact, Privacy, Terms)
for page in about contact privacy terms; do
  if ! curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$page.html" | grep -q "200"; then
    alert "⚠️ Missing page: $page"
  fi
done

# 5️⃣ Verify ToC presence on a sample article (first article)
first_article=$(find "$SITE_ROOT/src/content/articles" -type f -name "*.mdx" | head -n1)
if [[ -n "$first_article" ]]; then
  slug=$(basename "$first_article" .mdx)
  article_url="https://burniqo.com/$slug"
  if ! curl -s "$article_url" | grep -q "class.*toc"; then
    alert "⚠️ ToC missing on $article_url"
  fi
fi

# 6️⃣ Look for 404 errors in the built site
if grep -r "404" "$SITE_ROOT/dist" > /dev/null; then
  alert "⚠️ Potential 404 errors detected in built site"
fi

# Success message
alert "✅ Site health check completed"