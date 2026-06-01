import Link from 'next/link';
import CryptoBurnPage from './crypto/CryptoBurnPage';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            Burniqo
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CryptoBurnPage />
      </div>
    </div>
  );
}