import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — CYouInGreece',
  description: 'CYouInGreece is the most complete Greek travel guide online. Written by people who actually live here.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* HERO */}
      <section className="relative bg-[#0A1628] pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -right-10 top-10 text-[20vw] font-serif font-bold text-white/[0.025] leading-none whitespace-nowrap">About</span>
        </div>
        <div className="max-w-[900px] mx-auto px-6 md:px-12 relative z-10">
          <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">Who We Are</span>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-serif font-light text-white leading-[0.9] mb-8">
            The last honest<br />
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A027] to-[#C1440E]">
              guide to Greece.
            </em>
          </h1>
          <p className="font-serif italic text-white/60 text-xl max-w-2xl leading-relaxed">
            Not a press trip. Not a hotel fam tour. Not a listicle written from an office in London.
            This is Greece as it actually is — written by people who never left.
          </p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 md:py-36">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <div className="space-y-10 text-[1.1rem] font-serif text-[#0A1628] leading-[1.85]">
            <p>
              <span className="text-5xl float-left pr-4 mt-1 font-bold leading-[0.8] text-[#0A1628]">C</span>
              YouInGreece was built on a simple frustration: every travel website about Greece was written
              by someone who visited for a week and called it research. The recommendations were identical.
              The photography was identical. The advice — Santorini, Mykonos, Crete, rinse, repeat — was
              identical. We live here. We know it is not.
            </p>
            <p>
              Greece is 6,000 islands. Sixteen distinct geographical regions. Forty centuries of continuous
              civilisation. A gastronomy that changes not just from island to island but from village to village.
              A landscape that shifts from the green, wet mountains of Epirus to the bone-dry volcanic rock of
              Milos within a two-hour flight. Our mission is simple: document all of it, honestly, without
              commercial pressure, without sponsored enthusiasm, and without pretending that the tourist version
              of Greece is the real one.
            </p>
            <p>
              We are a small team of writers, photographers, and obsessives based across Greece — in Athens,
              in a village in the Mani, on the island of Syros, in Thessaloniki. Our content is written from
              direct experience. Our recommendations exist because we have eaten there, stayed there, walked there,
              and would go back. When we recommend against something, it is because we have seen what it actually is.
            </p>
            <p>
              We believe the best travel writing is specific. It names the taverna, the trail, the hour, the season.
              It tells you what the cook's name is and what she does wrong and right. It tells you how many steps
              the castle has and why the third-to-last one is the one to sit on. This is the standard we hold
              ourselves to. We are constantly failing to meet it. We keep trying anyway.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-[#0A1628]/10">
            {[
              { num: '55+', label: 'Destinations covered' },
              { num: '27+', label: 'Editorial articles' },
              { num: '100%', label: 'Written in Greece' },
              { num: '0', label: 'Press trips taken' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <span className="block text-[clamp(2rem,4vw,3rem)] font-serif text-[#D4A027] leading-none mb-2">{s.num}</span>
                <span className="text-[#0A1628]/50 text-xs uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NIKOS */}
      <section className="bg-[#0A1628] py-24 md:py-36">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full bg-[#D4A027]/20 border border-[#D4A027]/30 flex items-center justify-center">
              <span className="font-serif text-5xl text-[#D4A027]">Ν</span>
            </div>
            <div>
              <span className="text-[#D4A027] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">The Voice</span>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-white leading-tight mb-6">Nikos</h2>
              <p className="font-serif italic text-white/60 text-lg leading-relaxed">
                "I have lived in Greece my entire life and I still discover something new every year. That
                is either a failure of attention or a testament to the country's inexhaustibility. I prefer
                to think it is the latter. CYouInGreece is my attempt to share what I know before I forget
                what it felt like to not know it."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 text-center border-t border-[#0A1628]/10">
        <div className="max-w-xl mx-auto px-6">
          <span className="text-[#C1440E] tracking-[0.4em] uppercase text-[10px] font-bold block mb-6">Get in Touch</span>
          <h2 className="text-3xl font-serif text-[#0A1628] mb-6">Work with us</h2>
          <p className="text-[#0A1628]/60 font-light mb-10 leading-relaxed">
            For press enquiries, partnership proposals, destination coverage requests, or to report an error
            in our content, reach us at:
          </p>
          <a
            href="mailto:hello@cyouingreece.com"
            className="inline-flex items-center gap-3 px-10 py-4 border border-[#0A1628] text-[#0A1628] text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#0A1628] hover:text-white transition-colors duration-300"
          >
            hello@cyouingreece.com
          </a>
        </div>
      </section>
    </main>
  );
}
