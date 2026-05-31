import { SITE } from '@/lib/config'

export default function Footer({ site }: { site: typeof SITE }) {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {site.title}. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/about" className="hover:text-gray-700">About</a>
          <a href="/contact" className="hover:text-gray-700">Contact</a>
          <a href="/privacy" className="hover:text-gray-700">Privacy</a>
        </div>
      </div>
    </footer>
  )
}