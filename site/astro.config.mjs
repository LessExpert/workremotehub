import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // CHANGE to your real domain
  site: "https://workremotehub.com",

  output: "static",

  integrations: [
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
      serialize(item) {
        // Override priority for homepage
        if (item.url === "https://workremotehub.com/") {
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],

  markdown: {
    shikiConfig: {
      theme: "github-light",
      wrap: true,
    },
  },

  build: {
    // Ensure all content pages are included
    format: "directory",
  },

  vite: {
    ssr: {
      noExternal: [], // External deps as needed
    },
  },

  adapter: cloudflare()
});