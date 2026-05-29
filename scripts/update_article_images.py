#!/usr/bin/env python3
"""
Script to update WorkRemoteHub article images.
Scans for MDX articles missing image fields and adds appropriate Unsplash images.
"""
import os
import re
import subprocess
from pathlib import Path

# Configuration
SITE_PATH = "/root/workremotehub/site"
CONTENT_PATH = os.path.join(SITE_PATH, "src", "content", "articles")

# Curated image mapping from references/images.md
CURATED_IMAGES = {
    "logitech-mx-master-3s-vs-logitech-lift-ergonomic-mouse-remote-work": "photo-1586495777743-4413f21062af",
    "logitech-c920s-pro-vs-logitech-brio-500-webcam-remote-meetings": "photo-1573164713714-d95e436ab8d6",
    "best-standing-desk-converters-2026-reviews-remote-workers": "photo-1593642632559-0c6d3fc62b89",
    "rain-design-mstand-vs-twelve-south-curve-laptop-stand-remote-work": "photo-1498050108023-c5249f4df085",
    "nomatic-travel-pack-vs-aer-travel-pack-3-backpack-digital-nomad": "photo-1488646953014-85cb44e25828",
    "notion-vs-obsidian-knowledge-management-remote-workers": "photo-1512758017271-d7b84c2113f1",
    "best-focus-apps-remote-workers-2026-freedom-forest-brainfm": "photo-1434030216411-0b793f4b4173"
}

# Fallback images for topics without specific recommendations
FALLBACK_IMAGES = {
    "vpn": "photo-1563013544-824ae1b704d3",  # VPN/security related
    "hardware wallet": "photo-1639762681485-074b7f938ba0",  # Security/crypto
    "crypto freelancer": "photo-1559526324-593bc073d938",  # Remote work/laptop
    "default": "photo-1581091865777-b4c6a57a0c8a"  # Generic workspace
}

def get_image_for_topic(filename, frontmatter):
    """Determine appropriate image ID based on filename and frontmatter."""
    # Remove .mdx extension to get slug
    slug = filename[:-4] if filename.endswith('.mdx') else filename
    
    # Check if we have a curated recommendation
    if slug in CURATED_IMAGES:
        return CURATED_IMAGES[slug]
    
    # Check frontmatter for topic clues
    frontmatter_lower = frontmatter.lower()
    title = ""
    description = ""
    
    # Extract title and description from frontmatter
    title_match = re.search(r'title:\s*"([^"]*)"', frontmatter)
    if title_match:
        title = title_match.group(1).lower()
    
    desc_match = re.search(r'description:\s*"([^"]*)"', frontmatter)
    if desc_match:
        description = desc_match.group(1).lower()
    
    # Check for topic keywords
    combined_text = f"{title} {description} {frontmatter_lower}"
    
    if any(word in combined_text for word in ['vpn', 'nordvpn', 'expressvpn', 'surfshark', 'security', 'privacy']):
        return FALLBACK_IMAGES["vpn"]
    elif any(word in combined_text for word in ['hardware wallet', 'ledger', 'trezor', 'tangem', 'crypto', 'bitcoin']):
        return FALLBACK_IMAGES["hardware wallet"]
    elif any(word in combined_text for word in ['freelancer', 'crypto', 'getting paid', 'payment']):
        return FALLBACK_IMAGES["crypto freelancer"]
    else:
        return FALLBACK_IMAGES["default"]

def add_image_to_article(filepath):
    """Add image field to an MDX article if missing."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Extract frontmatter
        frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not frontmatter_match:
            print(f"  Skipping {os.path.basename(filepath)}: No frontmatter found")
            return False
        
        frontmatter = frontmatter_match.group(1)
        
        # Check if image field already exists
        if 'image:' in frontmatter:
            print(f"  Skipping {os.path.basename(filepath)}: Already has image")
            return False
        
        # Get appropriate image ID
        filename = os.path.basename(filepath)
        image_id = get_image_for_topic(filename, frontmatter)
        image_url = f"https://images.unsplash.com/photo-{image_id}?w=1200&h=600&fit=crop&auto=format"
        
        # Insert image field before the closing ---
        # Find the position of the closing ---
        end_frontmatter = content.find('\n---', 4)  # Start after first ---
        if end_frontmatter == -1:
            print(f"  Error: Could not find end of frontmatter in {os.path.basename(filepath)}")
            return False
        
        # Insert the image field - avoid backslash in f-string expression
        image_line = '\nimage: "' + image_url + '"\n'
        new_content = content[:end_frontmatter] + image_line + content[end_frontmatter:]
        
        # Write back to file
        with open(filepath, 'w') as f:
            f.write(new_content)
        
        print(f"  Added image to {os.path.basename(filepath)}: {image_url}")
        return True
        
    except Exception as e:
        print(f"  Error processing {os.path.basename(filepath)}: {e}")
        return False

def verify_image_url(url):
    """Verify that an image URL is accessible."""
    try:
        result = subprocess.run(['curl', '-sI', url], 
                              capture_output=True, text=True, timeout=10)
        return 'HTTP/2 200' in result.stdout or 'HTTP/1.1 200 OK' in result.stdout
    except:
        return False

def main():
    print("WorkRemoteHub Article Image Updater")
    print("=" * 40)
    
    if not os.path.exists(CONTENT_PATH):
        print(f"Error: Content path not found: {CONTENT_PATH}")
        return
    
    # Get all MDX files
    mdx_files = [f for f in os.listdir(CONTENT_PATH) if f.endswith('.mdx')]
    print(f"Found {len(mdx_files)} MDX articles")
    
    updated_count = 0
    for filename in mdx_files:
        filepath = os.path.join(CONTENT_PATH, filename)
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Extract frontmatter
        frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not frontmatter_match:
            continue
        
        frontmatter = frontmatter_match.group(1)
        
        # Check if image field is missing
        if 'image:' not in frontmatter:
            print(f"\n{filename}: Missing image field")
            if add_image_to_article(filepath):
                updated_count += 1
        else:
            # Optional: Verify existing images
            for line in frontmatter.split('\n'):
                if line.strip().startswith('image:'):
                    image_url = line.split('"')[1] if '"' in line else line.split(":")[1].strip().strip('"')
                    if not verify_image_url(image_url):
                        print(f"\n{filename}: Image URL inaccessible: {image_url}")
                    break
    
    if updated_count > 0:
        print(f"\nUpdated {updated_count} articles with images.")
        
        # Commit changes if in git repo
        try:
            os.chdir(SITE_PATH.replace('/site', ''))  # Go to workremotehub root
            subprocess.run(['git', 'add', '-A'], check=True)
            subprocess.run(['git', 'commit', '-m', 'Update article images via cron'], check=True)
            subprocess.run(['git', 'push'], check=True)
            print("Changes committed and pushed to git.")
        except subprocess.CalledProcessError as e:
            print(f"Git operations failed: {e}")
        except FileNotFoundError:
            print("Git not found or not in a git repository.")
    else:
        print("\nAll articles already have image fields.")

if __name__ == "__main__":
    main()