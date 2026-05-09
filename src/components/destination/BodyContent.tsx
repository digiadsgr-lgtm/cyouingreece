'use client';
import { PortableText } from '@portabletext/react';
import { Clock } from 'lucide-react';
import { destinationPortableTextComponents } from './PortableTextComponents';
import { AdInArticle } from '@/components/monetization/AdSlot';

interface Props {
  blocks: unknown[];
  destinationName?: string;
}

function estimateReadingTime(blocks: unknown[]): number {
  const text = JSON.stringify(blocks);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function BodyContent({ blocks, destinationName }: Props) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;
  const minutes = estimateReadingTime(blocks);

  // --- SMART CONTENT INJECTOR ---
  // Injects monetization widgets directly between paragraphs to avoid a "wall of ads" at the bottom
  const processedBlocks: unknown[] = [];
  let paragraphCount = 0;

  blocks.forEach((block: any) => {
    processedBlocks.push(block);
    
    if (block._type === 'block' && block.style === 'normal') {
      paragraphCount++;
      
      // Inject Booking Widget after 2nd paragraph (Top)
      if (paragraphCount === 2) {
        processedBlocks.push({ _type: 'widget_booking', _key: `injected-booking-${paragraphCount}` });
      }
      // Inject AdSense after 4th paragraph
      if (paragraphCount === 4) {
        processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
      }
      // Inject VRBO Widget after 6th paragraph (Middle)
      if (paragraphCount === 6) {
        processedBlocks.push({ _type: 'widget_vrbo', _key: `injected-vrbo-${paragraphCount}` });
      }
      // Inject Booking Widget after 9th paragraph (Middle-Bottom)
      if (paragraphCount === 9) {
        processedBlocks.push({ _type: 'widget_booking', _key: `injected-booking-${paragraphCount}` });
      }
      // Inject AdSense after 11th paragraph
      if (paragraphCount === 11) {
        processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
      }
      // Inject VRBO Widget after 14th paragraph
      if (paragraphCount === 14) {
        processedBlocks.push({ _type: 'widget_vrbo', _key: `injected-vrbo-${paragraphCount}` });
      }
      // Inject an AdSense slot every 3 paragraphs after 14th
      if (paragraphCount > 14 && (paragraphCount - 14) % 3 === 0) {
        processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
      }
      // Alternating Booking/VRBO every 4 paragraphs after 9th
      if (paragraphCount > 9 && (paragraphCount - 9) % 4 === 0 && paragraphCount !== 11 && paragraphCount !== 14) {
        const isBooking = ((paragraphCount - 9) / 4) % 2 === 1;
        processedBlocks.push({ _type: isBooking ? 'widget_booking' : 'widget_vrbo', _key: `injected-dynamic-${paragraphCount}` });
      }
    }
  });

  return (
    <article className="body-content" aria-label="Full destination guide">
      <div className="reading-time">
        <Clock size={13} aria-hidden="true" />
        <span>{minutes} min read</span>
      </div>

      <div className="prose">
        <PortableText
          value={processedBlocks as any}
          components={destinationPortableTextComponents}
        />
        
        {/* IN-ARTICLE AD AT THE END OF THE ARTICLE */}
        <div className="mt-16">
          <AdInArticle />
        </div>
      </div>

      <style>{`
        .body-content {
          max-width: 680px;
          padding: 2rem 0 3rem;
        }
        .reading-time {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.5);
          margin-bottom: 1.5rem;
          font-family: var(--font-inter), sans-serif;
        }
        .prose { font-family: var(--font-inter), sans-serif; }
      `}</style>
    </article>
  );
}
