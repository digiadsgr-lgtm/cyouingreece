'use client';
import { PortableText } from '@portabletext/react';
import { Clock } from 'lucide-react';
import { destinationPortableTextComponents } from './PortableTextComponents';

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
      
      // Inject Affiliate Links after 2nd paragraph
      if (paragraphCount === 2) {
        processedBlocks.push({ _type: 'widget_affiliate', _key: `injected-aff-${paragraphCount}`, destinationName });
      }
      // Inject Hotel Widget after 4th paragraph
      if (paragraphCount === 4) {
        processedBlocks.push({ _type: 'widget_hotel', _key: `injected-hot-${paragraphCount}` });
      }
      // Inject Rent A Car Widget after 6th paragraph
      if (paragraphCount === 6) {
        processedBlocks.push({ _type: 'widget_car', _key: `injected-car-${paragraphCount}` });
      }
      // Inject an AdSense slot every 4 paragraphs after the 7th
      if (paragraphCount > 6 && (paragraphCount - 6) % 4 === 0) {
        processedBlocks.push({ _type: 'widget_ad', _key: `injected-ad-${paragraphCount}` });
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
