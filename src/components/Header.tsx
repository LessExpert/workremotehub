import { NAV, SITE } from '@/lib/config'
import Link from 'next/link'

export default function Header({ nav, site }: { nav: typeof NAV; site: typeof SITE }) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">{site.title}</Link>
        <nav className="flex gap-6">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}