import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — CYouInGreece',
  description: 'Terms of Service for CYouInGreece.com',
};

export default function TermsPage() {
  const updated = 'May 5, 2026';
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <section className="pt-40 pb-20 bg-[#0A1628]">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">Legal</span>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-serif font-light text-white leading-tight">Terms of Service</h1>
          <p className="text-white/40 text-sm mt-4">Last updated: {updated}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <div className="space-y-10 text-[#4a4a4a] leading-relaxed font-light">

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CYouInGreece (<strong>cyouingreece.com</strong>), you accept and agree
                to be bound by these Terms of Service. If you do not agree, please do not use our site.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">2. Use of Content</h2>
              <p>
                All content on this site — including articles, photographs, destination guides, and editorial
                content — is the property of CYouInGreece and protected by copyright law. You may:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Read and share links to our content for personal, non-commercial purposes.</li>
                <li>Quote brief excerpts with clear attribution and a link back to the original.</li>
              </ul>
              <p className="mt-4">You may not reproduce, republish, scrape, or redistribute our content without written permission.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">3. Affiliate Disclosure</h2>
              <p>
                CYouInGreece participates in affiliate marketing programs. This means we may earn a commission
                when you click certain links and make purchases or bookings through third-party services
                (including Booking.com, GetYourGuide, Viator, and others) at no additional cost to you.
              </p>
              <p className="mt-4">
                Affiliate relationships do not influence our editorial opinions or recommendations. We only
                recommend services and destinations we genuinely believe in.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">4. Accuracy of Information</h2>
              <p>
                We strive to provide accurate, up-to-date travel information. However, travel conditions,
                prices, opening hours, and regulations change frequently. CYouInGreece is not liable for
                any inaccuracies or for decisions made based on our content. Always verify critical travel
                information with official sources before travelling.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">5. Third-Party Links</h2>
              <p>
                Our site contains links to third-party websites. We are not responsible for the content,
                privacy practices, or accuracy of any third-party site. Visiting linked sites is at your
                own risk.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">6. Limitation of Liability</h2>
              <p>
                CYouInGreece and its team are not liable for any direct, indirect, incidental, or
                consequential damages arising from your use of this site or from travel decisions made
                based on content published here.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the site after
                changes are posted constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">8. Governing Law</h2>
              <p>
                These Terms are governed by the laws of Greece and the European Union. Any disputes shall
                be subject to the exclusive jurisdiction of the courts of Athens, Greece.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0A1628] mb-4">9. Contact</h2>
              <p>
                Questions about these Terms? Email us at{' '}
                <a href="mailto:hello@cyouingreece.com" className="text-[#C1440E] underline">hello@cyouingreece.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
