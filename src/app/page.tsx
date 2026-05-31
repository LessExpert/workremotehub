import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { SITE } from '@/lib/config'

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { pubDate: 'desc' },
    take: 6,
    select: {
      slug: true, title: true, description: true,
      pubDate: true, contentType: true, tags: true,
    },
  })

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">{SITE.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">{SITE.description}</p>
        <Link href="/articles" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Browse Articles
        </Link>
      </section>

      {/* Latest Articles */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`}
              className="block p-5 border rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              {article.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {article.pubDate && <time>{new Date(article.pubDate).toLocaleDateString()}</time>}
                {article.contentType && <span className="capitalize">{article.contentType}</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
