import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Burniqo',
  description:
    'Learn about Burniqo — the crypto burn tracking and remote work resource platform built for the modern digital economy.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          About Burniqo
        </h1>

        {/* Mission */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            Burniqo bridges the gap between the rapidly evolving world of
            cryptocurrency tokenomics and the growing remote-work economy. We
            provide real-time burn tracking, market insights, and curated remote
            job resources — all in one place. Whether you&apos;re a seasoned
            crypto investor or a digital nomad searching for your next
            opportunity, Burniqo equips you with the data and tools you need to
            make informed decisions.
          </p>
        </section>

        {/* What We Do */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-900 p-6">
              <h3 className="text-lg font-semibold mb-2">
                🔥 Crypto Burn Tracking
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monitor live burn events, deflationary metrics, and tokenomics
                shifts across major blockchain networks. Understand how supply
                reductions impact value and make data-driven investment choices.
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-6">
              <h3 className="text-lg font-semibold mb-2">
                💼 Remote Work Hub
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover hand-picked remote job listings, freelance
                opportunities, and resources for digital nomads. From tech
                startups to established enterprises, find roles that let you
                work from anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Burniqo was founded by Jeff Vellingan, a software engineer and
            crypto enthusiast who saw the need for a unified platform that
            serves both the blockchain community and the remote workforce.
            Frustrated by fragmented tools and scattered data sources, Jeff
            built Burniqo to centralize actionable intelligence — empowering
            users to navigate decentralized finance and the gig economy with
            confidence.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We&apos;re a lean, remote-first team of developers, analysts, and
            content creators who believe in transparency, open access, and the
            transformative power of Web3 and borderless work.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong className="text-white">Transparency</strong> — We
                surface real, verifiable data. No hype, no hidden agendas.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong className="text-white">Accessibility</strong> — Crypto
                and remote work knowledge should be free and easy to understand.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong className="text-white">Independence</strong> — We
                operate without bias, delivering tools and insights that put
                users first.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong className="text-white">Community</strong> — Burniqo is
                built for and shaped by its users. Your feedback drives our
                roadmap.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}