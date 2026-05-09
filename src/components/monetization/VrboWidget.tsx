'use client';

import { useTranslations } from 'next-intl';

export default function VrboWidget() {
  const t = useTranslations('Navigation'); // Or any common translation namespace
  
  return (
    <div className="w-full bg-gradient-to-br from-[#030b15] to-[#0a192f] border border-white/10 rounded-2xl p-6 md:p-8 my-12 relative overflow-hidden group">
      {/* Background visual flair */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[#1855a5]/10 blur-[60px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[#D4A027]/5 blur-[60px] pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#1855a5]/20 text-[#1855a5] border border-[#1855a5]/30 rounded-full text-xs font-bold uppercase tracking-widest">
              Vrbo Select
            </span>
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
              Premium Rentals
            </span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight">
            Find Your Private Paradise in Greece
          </h3>
          
          <p className="text-white/70 text-lg leading-relaxed">
            From secluded villas in the Cyclades to authentic stone houses in the Peloponnese. Book your perfect holiday home with Vrbo.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-3 min-w-[280px]">
          <a
            href="https://www.dpbolvw.net/click-101742968-13525334"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1855a5]/50 px-6 py-4 rounded-xl transition-all duration-300"
          >
            <span className="text-white font-medium group-hover:text-[#1855a5] transition-colors">
              Greek Islands Rentals
            </span>
            <svg className="w-5 h-5 text-white/50 group-hover:text-[#1855a5] transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <img src="https://www.tqlkg.com/image-101742968-13525334" width="1" height="1" border="0" alt="" className="hidden" />
          </a>

          <a
            href="https://www.kqzyfj.com/click-101742968-13505427"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1855a5]/50 px-6 py-4 rounded-xl transition-all duration-300"
          >
            <span className="text-white font-medium group-hover:text-[#1855a5] transition-colors">
              Mainland Greece Rentals
            </span>
            <svg className="w-5 h-5 text-white/50 group-hover:text-[#1855a5] transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <img src="https://www.tqlkg.com/image-101742968-13505427" width="1" height="1" border="0" alt="" className="hidden" />
          </a>

          <a
            href="https://www.tkqlhce.com/click-101742968-13383553"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between w-full bg-[#1855a5] hover:bg-[#154a8f] text-white px-6 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(24,85,165,0.3)] hover:shadow-[0_0_30px_rgba(24,85,165,0.5)]"
          >
            <span className="font-bold">
              Explore All Properties
            </span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <img src="https://www.lduhtrp.net/image-101742968-13383553" width="1" height="1" border="0" alt="" className="hidden" />
          </a>
        </div>
      </div>
    </div>
  );
}
