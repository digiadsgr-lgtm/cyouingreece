"use client";

import React from 'react';
import { urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

export default function ThematicParallax({ sections }: { sections: any[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="w-full">
      {sections.map((section, idx) => (
        <section key={section._key} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Parallax Background */}
          {section.hero_image?.asset && (
            <div className="absolute inset-0 z-0 h-[120%] -top-[10%]">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed grayscale opacity-50"
                style={{ backgroundImage: `url(${urlFor(section.hero_image).width(1920).height(1080).url()})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-[#0A0A0A]/80" />
            </div>
          )}

          {/* Content Container */}
          <div className="relative z-10 container mx-auto px-6 max-w-4xl py-24">
            <div className="bg-[#111]/70 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-sm">
              <span className="text-brand-golden uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
                {section.category}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white tracking-widest uppercase mb-8">
                {section.title}
              </h2>
              <div className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed prose-p:font-light prose-a:text-brand-golden max-w-none">
                <PortableText value={section.content} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
