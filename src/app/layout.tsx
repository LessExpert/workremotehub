import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NAV, SITE } from '@/lib/config';

import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// Bitget Affiliate CTA
import AffiliateCTA from '@/components/AffiliateCTA';
import NewsletterSignup from '@/components/NewsletterSignup';

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
    type: 'website' as const,
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  facebook: {
    card: 'summary_large_image' as const,
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.language} className={inter.className}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
        />
        {/* Impact verification meta tag */}
        <meta name="Impact-Site-Verification" content="f53e62fe-378a-4082-885a-6fbe86b2005a" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <Header nav={NAV} site={SITE} />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <AffiliateCTA />
          <NewsletterSignup />
          {children}
        </main>
        <Footer site={SITE} />
      </body>
    </html>
  );
}
