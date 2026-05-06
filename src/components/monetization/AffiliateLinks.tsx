'use client';

interface AffiliateLinkBarProps {
  className?: string;
  destination?: string;
}

export default function AffiliateLinkBar({ className = '', destination = 'Greece' }: AffiliateLinkBarProps) {
  const links = [
    {
      id: 'aviasales',
      label: 'Find Cheap Flights',
      sublabel: `Flights to ${destination}`,
      href: 'https://aviasales.tpm.li/qOlHYArd',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m22 2-11 11M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      ),
      accent: '#C1440E',
      bg: 'from-[#C1440E]/10 to-[#C1440E]/5 border-[#C1440E]/20',
      hover: 'hover:border-[#C1440E]/60 hover:from-[#C1440E]/20',
    },
    {
      id: 'klook',
      label: 'Book Experiences',
      sublabel: `Tours & Activities`,
      href: 'https://klook.tpm.li/y58CNnMC',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      accent: '#D4A027',
      bg: 'from-[#D4A027]/10 to-[#D4A027]/5 border-[#D4A027]/20',
      hover: 'hover:border-[#D4A027]/60 hover:from-[#D4A027]/20',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`group flex items-center gap-4 p-5 rounded-2xl border bg-gradient-to-br ${link.bg} ${link.hover} transition-all duration-300`}
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'affiliate_click', {
                event_category: link.id,
                event_label: destination,
              });
            }
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${link.accent}20`, color: link.accent }}
          >
            {link.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm leading-tight">{link.label}</p>
            <p className="text-white/40 text-[11px] mt-0.5">{link.sublabel}</p>
          </div>
          <svg
            className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      ))}
      <p className="col-span-full text-[9px] text-white/20 uppercase tracking-widest text-center">
        Affiliate links · We earn a small commission at no extra cost to you
      </p>
    </div>
  );
}
