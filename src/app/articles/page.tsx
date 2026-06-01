import Link from "next/link";
import type { Metadata } from "next";
import { articles, type Article } from "@/lib/articles";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Guides, comparisons, and insights on remote work gear, crypto, freelancing, and the digital nomad lifestyle.",
  openGraph: {
    title: `Articles | ${SITE.title}`,
    description:
      "Guides, comparisons, and insights on remote work gear, crypto, freelancing, and the digital nomad lifestyle.",
    url: `${SITE.url}/articles`,
    siteName: SITE.title,
    type: "website",
  },
};

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-300"
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
        {article.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {article.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">·</span>
        <span>{article.readTime}</span>
        <span aria-hidden="true">·</span>
        <span>{article.author}</span>
      </div>
    </Link>
  );
}

export default function ArticlesPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <p className="mt-2 text-gray-600">
          Guides, comparisons, and insights on remote work gear, crypto,
          freelancing, and the digital nomad lifestyle.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No articles yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}