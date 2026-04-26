'use client';
import { PortableText } from '@portabletext/react';
import { Clock } from 'lucide-react';
import { destinationPortableTextComponents } from './PortableTextComponents';

interface Props {
  blocks: unknown[];
}

function estimateReadingTime(blocks: unknown[]): number {
  const text = JSON.stringify(blocks);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function BodyContent({ blocks }: Props) {
  if (!blocks || blocks.length === 0) return null;
  const minutes = estimateReadingTime(blocks);

  return (
    <article className="body-content" aria-label="Full destination guide">
      <div className="reading-time">
        <Clock size={13} aria-hidden="true" />
        <span>{minutes} min read</span>
      </div>

      <div className="prose">
        <PortableText
          value={blocks as any}
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
