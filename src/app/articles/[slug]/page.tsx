import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllSlugs } from '@/lib/articles';
import { SITE } from '@/lib/config';
import SocialShare from '@/components/SocialShare';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | ${SITE.title}`,
      description: article.description,
      url: `${SITE.url}/articles/${article.slug}`,
      siteName: SITE.title,
      type: "article" as const,
      authors: [article.author],
      publishedTime: article.date,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: article.title,
      description: article.description,
    },
  };
}

// Simple markdown-like content renderer
function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-2xl font-bold text-gray-900 mt-10 mb-4"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="text-xl font-semibold text-gray-900 mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Bold text line
    if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-semibold text-gray-900 my-4">
          {line.slice(2, -2)}
        </p>
      );
      i++;
      continue;
    }

    // Unordered list item
    if (line.match(/^- /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^- /)) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-1 text-gray-700 my-4">
          {listItems.map((item, idx) => {
            // Handle **bold** within list items
            const parts = item.split(/(\*\*.*?\*\*)/g);
            return (
              <li key={idx}>
                {parts.map((part, pi) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={pi} className="font-semibold text-gray-900">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </li>
            );
          })}
        </ul>
      );
      continue;
    }

    // Ordered list item
    if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-6 space-y-1 text-gray-700 my-4">
          {listItems.map((item, idx) => {
            const parts = item.split(/(\*\*.*?\*\*)/g);
            return (
              <li key={idx}>
                {parts.map((part, pi) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={pi} className="font-semibold text-gray-900">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </li>
            );
          })}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph (handle inline **bold**)
    const parts = line.split(/(\*\*.*?\*\*)/g);
    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed my-3">
        {parts.map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pi} className="font-semibold text-gray-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `${SITE.url}/articles/${article.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <header className="mb-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          {article.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 border-b border-gray-200 pb-6">
          <span className="font-medium text-gray-700">{article.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>
      </header>

      {/* Article body */}
      <div className="prose-like">
        <ArticleContent content={article.content} />
      </div>

      {/* Footer CTAs */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <SocialShare title={article.title} url={articleUrl} />
      </div>
    </article>
  );
}