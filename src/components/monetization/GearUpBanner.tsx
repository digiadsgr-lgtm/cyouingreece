'use client';

export default function GearUpBanner() {
  return (
    <div className="w-full bg-[#030b15] py-4 md:py-8 flex justify-center items-center">
      <div className="w-full max-w-[1000px] rounded-xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <a 
          href="https://www.tkqlhce.com/click-101742968-17235976" 
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <img 
            src="https://www.ftjcfx.com/image-101742968-17235976" 
            alt="Gear Up for Games"
            width={1001} 
            height={691} 
            className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500" 
            border={0}
          />
        </a>
      </div>
    </div>
  );
}
