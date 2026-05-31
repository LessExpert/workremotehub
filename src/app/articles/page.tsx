import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { pubDate: 'desc' },
    select: {
      slug: true, title: true, description: true,
      pubDate: true, contentType: true, wordCount: true, tags: true,
      author: { select: { name: true } },
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Articles</h1>
      <div className="grid gap-6">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`}
            className="block p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
            {article.description && <p className="text-gray-600 mb-3">{article.description}</p>}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {article.pubDate && <time>{new Date(article.pubDate).toLocaleDateString()}</time>}
              {article.contentType && <span className="capitalize">{article.contentType}</span>}
              {article.wordCount && <span>{article.wordCount} words</span>}
            </div>
            {(() => { const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags; return tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{tag}</span>
                ))}
              </div>
            ); })()}
          </Link>
        ))}
      </div>
    </div>
  )
}
