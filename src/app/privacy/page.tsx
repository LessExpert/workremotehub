import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Burniqo Privacy Policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Last updated: June 1, 2026
        </p>

        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-400 leading-relaxed">
            Burniqo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit our website{' '}
            <strong className="text-white">burniqo.com</strong> (the
            &quot;Site&quot;). By using the Site, you consent to the data
            practices described in this policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-gray-900 p-5">
              <h3 className="font-semibold mb-2">
                2.1 Information You Provide
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We may collect personal information that you voluntarily provide
                when you subscribe to our newsletter, submit a contact form, or
                otherwise interact with the Site. This may include your name,
                email address, and any message content you choose to share.
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-5">
              <h3 className="font-semibold mb-2">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                When you visit the Site, we automatically collect certain
                information about your device and browsing behavior, including
                your IP address, browser type, operating system, referring URLs,
                pages viewed, and the dates/times of your visits. We may use
                cookies and similar tracking technologies (see Section 3).
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-5">
              <h3 className="font-semibold mb-2">
                2.3 Third-Party Services
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We use third-party services such as Google Analytics, Google
                AdSense, and affiliate platforms (e.g., Bitget). These services
                may collect information about your visits to our Site and other
                websites in order to provide targeted advertisements and
                analytics. Please refer to their respective privacy policies for
                more details.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            3. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We use cookies, web beacons, and similar technologies to enhance
            your browsing experience, analyze Site traffic, and serve
            personalized advertisements. Cookies are small text files stored on
            your device by your web browser.
          </p>
          <p className="text-gray-400 leading-relaxed">
            You can control cookie preferences through your browser settings.
            Disabling cookies may affect the functionality of certain features
            on the Site. By continuing to use the Site, you consent to our use
            of cookies as described herein.
          </p>
        </section>

        {/* How We Use */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            4. How We Use Your Information
          </h2>
          <p className="text-gray-400 leading-relaxed mb-3">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
            <li>To operate, maintain, and improve the Site</li>
            <li>To send newsletters and promotional communications (with your consent)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To analyze usage patterns and optimize user experience</li>
            <li>To serve relevant advertisements through Google AdSense and affiliates</li>
            <li>To detect, prevent, and address technical issues or abuse</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        {/* Sharing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            5. How We Share Your Information
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We do not sell your personal information. We may share data in the
            following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
            <li>
              <strong className="text-white">Service Providers</strong> — With
              trusted third parties who assist us in operating the Site (e.g.,
              hosting, analytics, email delivery).
            </li>
            <li>
              <strong className="text-white">Legal Requirements</strong> — If
              required by law, court order, or government regulation.
            </li>
            <li>
              <strong className="text-white">Business Transfers</strong> — In
              connection with a merger, acquisition, or sale of assets, your
              information may be transferred.
            </li>
            <li>
              <strong className="text-white">With Your Consent</strong> — We
              may share your information for any other purpose with your
              explicit permission.
            </li>
          </ul>
        </section>

        {/* Security */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p className="text-gray-400 leading-relaxed">
            We implement industry-standard security measures to protect your
            personal information from unauthorized access, alteration,
            disclosure, or destruction. However, no method of electronic storage
            or transmission over the Internet is 100% secure. While we strive to
            use commercially acceptable means to protect your data, we cannot
            guarantee absolute security.
          </p>
        </section>

        {/* Rights */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="text-gray-400 leading-relaxed mb-3">
            Depending on your jurisdiction, you may have the following rights
            regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
            <li>Right to access the personal data we hold about you</li>
            <li>Right to request correction of inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to object to or restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p className="text-gray-400 leading-relaxed mt-4">
            To exercise any of these rights, please contact us at{' '}
            <a
              href="mailto:hello@burniqo.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              hello@burniqo.com
            </a>.
          </p>
        </section>

        {/* Children */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p className="text-gray-400 leading-relaxed">
            The Site is not intended for individuals under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you are a parent or guardian and believe your child has provided
            us with personal data, please contact us immediately and we will
            take steps to remove such information.
          </p>
        </section>

        {/* Changes */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            9. Changes to This Policy
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we
            will revise the &quot;Last updated&quot; date at the top of this
            page. We encourage you to review this policy periodically to stay
            informed about how we protect your information. Continued use of the
            Site after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-gray-400 leading-relaxed">
            If you have questions or concerns about this Privacy Policy, please
            reach out:
          </p>
          <p className="text-gray-400 mt-2">
            📧{' '}
            <a
              href="mailto:hello@burniqo.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              hello@burniqo.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}