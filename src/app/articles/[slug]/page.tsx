import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true },
  })
  if (!article) return { title: 'Not Found' }
  return {
    title: article.title,
    description: article.description,
    openGraph: { title: article.title, description: article.description, type: 'article' },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: { select: { name: true } } },
  })

  if (!article) notFound()

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
        {article.description && (
          <p className="text-xl text-gray-600">{article.description}</p>
        )}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          {article.pubDate && <time>{new Date(article.pubDate).toLocaleDateString()}</time>}
          {article.author?.name && <span>by {article.author.name}</span>}
          {article.wordCount && <span>{article.wordCount} words</span>}
        </div>
        {(() => { const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags; return tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">{tag}</span>
            ))}
          </div>
        ); })()}
      </header>

      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  )
}
