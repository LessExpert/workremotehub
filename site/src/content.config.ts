import { defineCollection, z } from "astro:content";

const articlesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    pubDate: z.string(),
    contentType: z.string().optional(),
    wordCount: z.number().optional(),
    tags: z.array(z.string()).optional(),
    schema: z.any().optional(),
    affiliateLinks: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  articles: articlesCollection,
};