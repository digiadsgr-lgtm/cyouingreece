import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — CYouInGreece',
  description: 'Privacy Policy for CYouInGreece.com — how we collect, use and protect your data.',
};

export default function PrivacyPage() {
  const updated = 'May 5, 2026';
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <section className="pt-40 pb-20 bg-[#0A1628]">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">Legal</span>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-serif font-light text-white leading-tight">Privacy Policy</h1>
          <p className="text-white/40 text-sm mt-4">Last updated: {updated}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 prose prose-lg text-[#0A1628]" style={{ maxWidth: 'none' }}>
          <div className="space-y-10 text-[#4a4a4a] leading-relaxed font-light">

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">1. Introduction</h2>
              <p>
                Welcome to CYouInGreece ("we", "our", "us"). We are committed to protecting your personal
                information and your right to privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website{' '}
                <strong>cyouingreece.com</strong> (the "Site"). Please read it carefully.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Personal Data:</strong> Email address when you subscribe to our newsletter.</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent — collected automatically via analytics tools.</li>
                <li><strong>Cookies:</strong> Small data files stored on your device to enhance your experience and enable advertising features.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To send our newsletter if you have subscribed (you may unsubscribe at any time).</li>
                <li>To analyse site traffic and improve content quality.</li>
                <li>To serve relevant advertising through Google AdSense and affiliate partners.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">4. Cookies & Advertising</h2>
              <p>
                We use cookies for analytics (Google Analytics) and advertising (Google AdSense). Third-party
                vendors, including Google, use cookies to serve ads based on your prior visits to our site.
                You may opt out of personalised advertising by visiting{' '}
                <a href="https://www.google.com/settings/ads" className="text-[#C1440E] underline" target="_blank" rel="noopener noreferrer">
                  Google Ad Settings
                </a>.
              </p>
              <p className="mt-4">
                We also participate in affiliate programs including Booking.com, GetYourGuide, and Viator.
                When you click an affiliate link and make a purchase, we may earn a commission at no extra
                cost to you. All affiliate relationships are disclosed clearly on relevant pages.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">5. Third-Party Services</h2>
              <p>We use the following third-party services which have their own privacy policies:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Google Analytics — <a href="https://policies.google.com/privacy" className="text-[#C1440E] underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                <li>Google AdSense — <a href="https://policies.google.com/privacy" className="text-[#C1440E] underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                <li>Booking.com — <a href="https://www.booking.com/content/privacy.html" className="text-[#C1440E] underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                <li>GetYourGuide — <a href="https://www.getyourguide.com/legal/privacy-policy" className="text-[#C1440E] underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                <li>Sanity.io (CMS) — <a href="https://www.sanity.io/privacy" className="text-[#C1440E] underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">6. Data Retention</h2>
              <p>
                We retain your email address for as long as you remain subscribed to our newsletter. You may
                request deletion at any time by emailing us. Usage data collected by analytics tools is
                retained according to each provider's standard retention policies.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">7. Your Rights (GDPR)</h2>
              <p>If you are located in the European Economic Area, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data ("right to be forgotten").</li>
                <li>Object to processing of your data.</li>
                <li>Data portability.</li>
              </ul>
              <p className="mt-4">To exercise any of these rights, contact us at <strong>hello@cyouingreece.com</strong>.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">8. Children's Privacy</h2>
              <p>Our site is not directed to children under 13. We do not knowingly collect personal data from children.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">9. Changes to This Policy</h2>
              <p>We may update this policy periodically. We will notify you of significant changes by updating the date at the top of this page. Continued use of the site after changes constitutes acceptance.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">10. Contact</h2>
              <p>
                For any privacy-related questions, contact us at{' '}
                <a href="mailto:hello@cyouingreece.com" className="text-[#C1440E] underline">hello@cyouingreece.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
