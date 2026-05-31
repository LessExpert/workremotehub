import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NAV, SITE } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: SITE.title,
    template: `%s | ${SITE.title}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.title,
    images: [{ url: SITE.ogImage }],
    locale: SITE.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.language} className={inter.className}>
      <head>
        {/* Impact verification meta tag */}
        <meta name="Impact-Site-Verification" content="f53e62fe-378a-4082-885a-6fbe86b2005a" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <Header nav={NAV} site={SITE} />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <Footer site={SITE} />
      </body>
    </html>
  );
}
