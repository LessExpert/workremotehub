import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://workremotehub.com", // CHANGE to your real domain
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
});