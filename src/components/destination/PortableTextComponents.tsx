'use client';
import Image from 'next/image';
import type { PortableTextComponents } from '@portabletext/react';
import AffiliateLinkBar from '@/components/monetization/AffiliateLinks';
import HotelWidget from '@/components/monetization/HotelWidget';
import RentACarWidget from '@/components/monetization/RentACarWidget';
import AdSlot from '@/components/monetization/AdSlot';
import BookingWidget from '@/components/monetization/BookingWidget';

import { urlFor } from '@/lib/sanity';

// ─── Custom Portable Text block components ────────────────────────────────────

export const destinationPortableTextComponents: PortableTextComponents = {
  types: {
    // Full-bleed image inside prose
    image: ({ value }) => {
      const imgUrl = value?.asset?._ref ? urlFor(value).auto('format').url() : null;
      if (!imgUrl) return null;
      return (
        <figure className="pt-photo-embed">
          <div className="pt-photo-wrap">
            <Image
              src={imgUrl}
              alt={value.caption || 'Destination photo'}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {(value.caption || value.credit) && (
            <figcaption className="pt-photo-caption">
              {value.caption}
              {value.credit && <span> — Photo: {value.credit}</span>}
            </figcaption>
          )}
        </figure>
      );
    },

    // Pull quote — large Playfair italic
    pullQuote: ({ value }) => (
      <blockquote className="pt-pullquote">
        <p>"{value.text}"</p>
      </blockquote>
    ),

    // Teal info box
    infoBox: ({ value }) => (
      <div className="pt-infobox">
        {value.title && <h4 className="pt-infobox-title">{value.title}</h4>}
        <p className="pt-infobox-body">{value.content}</p>
      </div>
    ),

    // Nikos golden-border tip callout
    nikosTip: ({ value }) => (
      <div className="pt-nikos-tip">
        <div className="pt-nikos-avatar" aria-hidden="true">
          <span>N</span>
        </div>
        <div className="pt-nikos-content">
          <span className="pt-nikos-label">Nikos says</span>
          <p className="pt-nikos-text">{value.tip}</p>
        </div>
      </div>
    ),

    // Injected Smart Widgets
    widget_ad: () => (
      <div className="my-12 w-full flex justify-center">
        <AdSlot format="horizontal" />
      </div>
    ),
    widget_booking: () => (
      <div className="my-14 w-full">
        <BookingWidget destination="Greece" />
      </div>
    ),
  },

  block: {
    h2: ({ children }) => <h2 className="pt-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="pt-h4">{children}</h4>,
    normal: ({ children }) => <p className="pt-p">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="pt-blockquote">{children}</blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="pt-strong">{children}</strong>,
    em: ({ children }) => <em className="pt-em">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="pt-link"
      >
        {children}
      </a>
    ),
  },

  list: {
    bullet: ({ children }) => <ul className="pt-ul">{children}</ul>,
    number: ({ children }) => <ol className="pt-ol">{children}</ol>,
  },

  listItem: {
    bullet: ({ children }) => <li className="pt-li">{children}</li>,
    number: ({ children }) => <li className="pt-li">{children}</li>,
  },
};

// Note: Styles for portable text blocks are in globals.css under .pt-* selectors

