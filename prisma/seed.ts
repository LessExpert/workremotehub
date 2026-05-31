import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding articles...')
  
  // Create default admin user
  const admin = await prisma.user.upsert({
    where: { email: 'hello@burniqo.com' },
    update: {},
    create: {
      email: 'hello@burniqo.com',
      name: 'Jeff Vellingan',
      role: 'ADMIN',
    },
  })
  console.log(`Admin user: ${admin.email}`)

  // Read articles from content directory
  const fs = require('fs')
  const path = require('path')
  const matter = require('gray-matter')
  
  const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles')
  const files = fs.readdirSync(articlesDir).filter((f: string) => f.endsWith('.mdx'))

  for (const file of files) {
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8')
    const { data, content } = matter(raw)
    
    const article = {
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      content: content.trim(),
      pubDate: data.pubDate ? new Date(data.pubDate) : new Date(),
      contentType: data.contentType || 'article',
      wordCount: data.wordCount || content.split(/\s+/).length,
      tags: JSON.stringify(data.tags || []),
      published: !data.draft,
      authorId: admin.id,
    }

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    })
    console.log(`  ✓ ${article.slug}`)
  }

  console.log(`Seeded ${files.length} articles`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
