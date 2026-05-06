import Link from 'next/link';

export default function SEOLinkMatrix({ currentLocale }: { currentLocale: string }) {
  // A dynamic matrix of high-value internal links structured by intent
  // This builds thematic clusters for Googlebot
  
  const regions = [
    { name: 'Cyclades Islands', slug: 'cyclades' },
    { name: 'Ionian Islands', slug: 'ionian' },
    { name: 'Dodecanese', slug: 'dodecanese' },
    { name: 'Crete Region', slug: 'crete' },
    { name: 'Peloponnese', slug: 'peloponnese' },
    { name: 'Epirus', slug: 'epirus' }
  ];

  const experiences = [
    { name: 'Best Beaches in Greece', slug: 'sea' },
    { name: 'Greek Gastronomy', slug: 'gastronomy' },
    { name: 'Ancient Greek Culture', slug: 'culture' },
    { name: 'Mountain Trails', slug: 'mountain' }
  ];

  const popular = [
    { name: 'Santorini Travel Guide', slug: 'santorini' },
    { name: 'Mykonos Nightlife', slug: 'mykonos' },
    { name: 'Athens City Break', slug: 'athens' },
    { name: 'Milos Hidden Beaches', slug: 'milos' },
    { name: 'Naxos Food Guide', slug: 'naxos' },
    { name: 'Paros Architecture', slug: 'paros' }
  ];

  return (
    <div className="w-full bg-[#0A1628] border-t border-white/10 py-16 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          
          {/* Column 1: Regions */}
          <div className="flex-1">
            <h4 className="text-[#D4A027] font-bold text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-4">
              Explore by Region
            </h4>
            <ul className="flex flex-col gap-3">
              {regions.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${currentLocale}/encyclopaedia`} className="text-white/60 text-xs font-serif hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Experiences */}
          <div className="flex-1">
            <h4 className="text-[#D4A027] font-bold text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-4">
              Greek Experiences
            </h4>
            <ul className="flex flex-col gap-3">
              {experiences.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${currentLocale}/category/${item.slug}`} className="text-white/60 text-xs font-serif hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Guides */}
          <div className="flex-1">
            <h4 className="text-[#D4A027] font-bold text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-4">
              Top Destination Guides
            </h4>
            <ul className="flex flex-col gap-3">
              {popular.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${currentLocale}/destination/${item.slug}`} className="text-white/60 text-xs font-serif hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
