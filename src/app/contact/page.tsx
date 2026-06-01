import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Burniqo',
  description:
    'Get in touch with the Burniqo team — questions, feedback, partnerships, or press inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-gray-400 leading-relaxed mb-10 max-w-xl">
          Have a question, feedback, or want to explore a partnership? We&apos;d
          love to hear from you. Reach out using the details below and we&apos;ll
          get back to you as soon as possible.
        </p>

        {/* Contact Methods */}
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          <div className="rounded-xl bg-gray-900 p-6">
            <h2 className="text-xl font-semibold mb-3">📧 Email</h2>
            <p className="text-gray-400 text-sm mb-2">
              For general inquiries, support, or press:
            </p>
            <a
              href="mailto:hello@burniqo.com"
              className="text-blue-400 hover:text-blue-300 underline break-all"
            >
              hello@burniqo.com
            </a>
          </div>
          <div className="rounded-xl bg-gray-900 p-6">
            <h2 className="text-xl font-semibold mb-3">🐦 Social</h2>
            <p className="text-gray-400 text-sm mb-2">
              Follow us for updates, market insights, and new job listings.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://twitter.com/burniqo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Twitter / X — @burniqo
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/burniqo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Discord — Join our community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Response Time */}
        <div className="rounded-xl bg-gray-900 p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3">⏱️ Response Time</h2>
          <p className="text-gray-400 leading-relaxed">
            We typically respond within 24–48 hours on business days. For urgent
            matters, please include &quot;URGENT&quot; in your email subject
            line and we&apos;ll prioritize your message.
          </p>
        </div>

        {/* Partnerships */}
        <div className="rounded-xl bg-gray-900 p-6">
          <h2 className="text-xl font-semibold mb-3">🤝 Partnerships</h2>
          <p className="text-gray-400 leading-relaxed mb-3">
            Interested in collaborating with Burniqo? We welcome inquiries from:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
            <li>Blockchain projects seeking exposure for their burn mechanisms</li>
            <li>Remote-first companies looking to feature job listings</li>
            <li>Content creators and analysts for guest contributions</li>
            <li>Affiliates and sponsors in the crypto and remote work space</li>
          </ul>
        </div>
      </div>
    </div>
  );
}