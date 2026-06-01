import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Burniqo Terms of Service — the rules and guidelines for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Last updated: June 1, 2026
        </p>

        {/* 1. Acceptance */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-400 leading-relaxed">
            By accessing or using Burniqo (&quot;the Site&quot;), located at{' '}
            <strong className="text-white">burniqo.com</strong>, you agree to be
            bound by these Terms of Service (&quot;Terms&quot;). If you do not
            agree to these Terms, you must not access or use the Site. These
            Terms apply to all visitors, users, and others who access or use the
            Site.
          </p>
        </section>

        {/* 2. Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Burniqo is a crypto burn tracking and remote work resource platform.
            We provide:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
            <li>Real-time cryptocurrency burn tracking and tokenomics data</li>
            <li>Curated remote job listings and digital nomad resources</li>
            <li>Educational articles on blockchain technology and remote work</li>
            <li>Affiliate links and sponsored content from third-party partners</li>
          </ul>
          <p className="text-gray-400 leading-relaxed mt-4">
            All information on the Site is provided for general informational
            purposes only and should not be construed as financial, legal, or
            professional advice.
          </p>
        </section>

        {/* 3. User Obligations */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            3. User Obligations
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-900 p-5">
              <h3 className="font-semibold mb-2">3.1 Eligibility</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You must be at least 13 years of age to use the Site. By using the
                Site, you represent and warrant that you meet this age requirement.
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-5">
              <h3 className="font-semibold mb-2">3.2 Prohibited Conduct</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                <li>Use the Site for any unlawful purpose</li>
                <li>Attempt to interfere with the proper functioning of the Site</li>
                <li>Scrape, data-mine, or otherwise extract data without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Intellectual Property */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            4. Intellectual Property
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            All content on the Site — including but not limited to text,
            graphics, logos, icons, images, data compilations, and software — is
            the property of Burniqo or its content suppliers and is protected by
            international copyright and trademark laws.
          </p>
          <p className="text-gray-400 leading-relaxed">
            You may view, download, and print pages from the Site for your
            personal, non-commercial use only. You may not reproduce,
            distribute, modify, create derivative works from, publicly display,
            or exploit any content without our prior written consent.
          </p>
        </section>

        {/* 5. Third-Party Links & Affiliates */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            5. Third-Party Links and Affiliate Disclosure
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The Site may contain links to third-party websites, advertisements,
            and affiliate offers. We may earn a commission when you click on
            affiliate links or make purchases through them — at no additional
            cost to you. We only promote products and services we believe
            provide value to our audience.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Burniqo is not responsible for the content, accuracy, or practices
            of any third-party websites. Your interactions with third parties
            are solely between you and the third party, and we encourage you to
            review their terms and privacy policies.
          </p>
        </section>

        {/* 6. Disclaimer */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            6. Disclaimer of Warranties
          </h2>
          <p className="text-gray-400 leading-relaxed">
            The Site is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis. Burniqo makes no representations or
            warranties of any kind, express or implied, regarding the operation
            of the Site or the information, content, materials, or products
            included. To the fullest extent permitted by law, we disclaim all
            warranties, including but not limited to implied warranties of
            merchantability and fitness for a particular purpose. We do not
            warrant that the Site will be uninterrupted, error-free, or free of
            viruses or other harmful components.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-gray-400 leading-relaxed">
            To the maximum extent permitted by applicable law, Burniqo and its
            officers, directors, employees, and agents shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages — including but not limited to loss of profits, data, use,
            goodwill, or other intangible losses — arising out of or related to
            your use or inability to use the Site, whether based on warranty,
            contract, tort, or any other legal theory.
          </p>
        </section>

        {/* 8. No Financial Advice */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            8. No Financial Advice
          </h2>
          <div className="rounded-xl bg-gray-900 p-5">
            <p className="text-gray-400 text-sm leading-relaxed">
              Nothing on Burniqo constitutes financial, investment, legal, or
              tax advice. Cryptocurrency investments are highly volatile and
              involve substantial risk. You should conduct your own research and
              consult with qualified professionals before making any investment
              decisions. Past performance is not indicative of future results,
              and token burn events do not guarantee price appreciation.
            </p>
          </div>
        </section>

        {/* 9. Indemnification */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            9. Indemnification
          </h2>
          <p className="text-gray-400 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Burniqo and its
            affiliates from any claims, damages, liabilities, costs, or expenses
            (including reasonable attorneys&apos; fees) arising out of your use
            of the Site, your violation of these Terms, or your infringement of
            any intellectual property or other rights of any person or entity.
          </p>
        </section>

        {/* 10. Termination */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="text-gray-400 leading-relaxed">
            We reserve the right to terminate or suspend your access to the Site
            at our sole discretion, without prior notice or liability, for any
            reason — including breach of these Terms. Upon termination, your
            right to use the Site will immediately cease, and provisions of
            these Terms that by their nature should survive termination shall
            continue in effect.
          </p>
        </section>

        {/* 11. Changes */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            11. Changes to Terms
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We may revise these Terms at any time by updating this page. Changes
            take effect immediately upon posting. Your continued use of the Site
            after any changes constitutes your acceptance of the revised Terms.
            We encourage you to review this page periodically.
          </p>
        </section>

        {/* 12. Governing Law */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            12. Governing Law
          </h2>
          <p className="text-gray-400 leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of South Africa, without regard to its conflict of law
            provisions. Any disputes arising under these Terms shall be subject
            to the exclusive jurisdiction of the courts located in South Africa.
          </p>
        </section>

        {/* 13. Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
          <p className="text-gray-400 leading-relaxed">
            If you have questions about these Terms, please contact us at{' '}
            <a
              href="mailto:hello@burniqo.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              hello@burniqo.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}