'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollNodes({ displayNodes }: { displayNodes: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Select all node rows
    const rows = containerRef.current.querySelectorAll('.node-row');
    
    rows.forEach((row) => {
      const imgContainer = row.querySelector('.img-container');
      const img = row.querySelector('.parallax-img');
      const textBlock = row.querySelector('.text-block');
      
      // The massive fade-in and slide up (Alpha Reveal)
      gsap.fromTo(row, 
        { opacity: 0, y: 150 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%", // starts when top of row hits 85% of viewport
            toggleActions: "play none none reverse"
          }
        }
      );
      
      // The internal image Parallax (Moving the image slightly inside its container on scroll)
      if (imgContainer && img) {
         gsap.fromTo(img, 
           { y: "-15%" }, 
           {
             y: "15%",
             ease: "none",
             scrollTrigger: {
               trigger: imgContainer,
               start: "top bottom",
               end: "bottom top",
               scrub: true
             }
           }
         );
      }
    });
    
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [displayNodes]);

  return (
    <div ref={containerRef} className="flex flex-col space-y-32">
      {displayNodes.map((node, i) => (
        <div key={i} className={`node-row flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 group`}>
          {/* Massive Image Container */}
          <div className="img-container w-full md:w-3/5 h-[600px] relative overflow-hidden rounded-sm cursor-pointer magnetic">
            <div className="absolute inset-0 bg-[#001122] z-10 opacity-40 group-hover:opacity-0 transition-opacity duration-1000 mix-blend-multiply"></div>
            <img 
              src={node.img} 
              alt={node.title}
              className="parallax-img absolute inset-0 w-full h-[130%] object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
          </div>
          
          {/* Floating Typography Block */}
          <div className={`text-block w-full md:w-2/5 flex flex-col ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 border-l-2 border-[#D4AF37] pl-3 py-1">
              {node.tag}
            </span>
            <h3 className="text-5xl font-serif text-white mb-6 group-hover:text-[#D4AF37] transition-colors duration-500 magnetic cursor-pointer inline-block self-start">{node.title}</h3>
            <p className="text-gray-400 font-light text-lg leading-relaxed mb-10">{node.desc}</p>
            
            <button className="self-start relative group/btn overflow-hidden border border-white/20 px-8 py-4 magnetic">
              <span className="relative z-10 text-white text-xs tracking-widest uppercase font-semibold group-hover/btn:text-[#000814] transition-colors duration-500">
                Explore Protocol
              </span>
              <div className="absolute inset-0 bg-white transform -translate-x-[101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"></div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
