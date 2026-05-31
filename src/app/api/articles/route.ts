import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/articles - List all published articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, description: true,
        pubDate: true, contentType: true, wordCount: true, tags: true,
        author: { select: { name: true } }
      }
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST /api/articles - Create new article
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.slug) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  try {
    const article = await prisma.article.create({
      data: {
        title: body.title, slug: body.slug, description: body.description,
        content: body.content, contentType: body.contentType,
        wordCount: body.wordCount, tags: body.tags,
        pubDate: body.pubDate, authorId: body.authorId,
        published: body.published ?? false
      }
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
