import { Calendar, Music, Landmark, Star } from 'lucide-react';
import type { LocalEvent } from '@/lib/destination-types';

interface Props {
  events: LocalEvent[];
  destinationName: string;
  bestMonths?: string[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  festival: <Star size={13} />,
  music: <Music size={13} />,
  cultural: <Landmark size={13} />,
  religious: <Star size={13} />,
  other: <Calendar size={13} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  festival: '#D4A027',
  music: '#64B5F6',
  cultural: '#CE93D8',
  religious: '#81C784',
  other: 'rgba(255,255,255,0.4)',
};

const SEASONAL_HIGHLIGHTS = [
  { month: 'Spring', highlight: 'Greek Easter celebrations, wildflower season, perfect hiking weather.' },
  { month: 'Summer', highlight: 'Traditional panigiri (village festivals) with live music and open-air dancing.' },
  { month: 'Autumn', highlight: 'Wine harvest festivals, olive picking season, cooler temperatures.' },
  { month: 'Winter', highlight: 'Quiet, local-led Christmas traditions, mountain villages, off-season charm.' },
];

export default function LiveEventsWidget({ events, destinationName, bestMonths }: Props) {
  const hasEvents = events?.length > 0;

  return (
    <section className="events-section" aria-labelledby="events-heading">
      <div className="events-header">
        <h2 id="events-heading" className="events-title">
          <Calendar size={20} aria-hidden="true" />
          {hasEvents ? 'Upcoming Events' : 'Seasonal Highlights'}
        </h2>
        <p className="events-subtitle">
          {hasEvents ? `What's happening in ${destinationName}` : 'What to expect through the year'}
        </p>
      </div>

      {hasEvents ? (
        <div className="events-grid">
          {events.slice(0, 4).map((event, i) => {
            const color = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.other;
            return (
              <article key={i} className="event-card">
                <div className="event-category" style={{ color }}>
                  {CATEGORY_ICONS[event.category] ?? <Calendar size={13} />}
                  <span>{event.category}</span>
                </div>
                <div className="event-date">
                  {event.date ? new Date(event.date).toLocaleDateString('en', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : 'Date TBC'}
                </div>
                <h3 className="event-name">{event.name}</h3>
                {event.location && (
                  <p className="event-location">📍 {event.location}</p>
                )}
                {event.link && (
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-link">
                    Learn more →
                  </a>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="seasonal-grid">
          {SEASONAL_HIGHLIGHTS.map(({ month, highlight }) => (
            <div key={month} className="seasonal-card">
              <span className="seasonal-month">{month}</span>
              <p className="seasonal-text">{highlight}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .events-section { padding: 3rem 0; }
        .events-header { margin-bottom: 1.75rem; }
        .events-title {
          font-family: var(--font-serif), serif;
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          color: #FAF9F6;
          margin: 0 0 0.4rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .events-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); font-style: italic; margin: 0; font-family: var(--font-inter), sans-serif; }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (max-width: 640px) { .events-grid { grid-template-columns: 1fr; } }

        .event-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          transition: border-color 0.2s;
        }
        .event-card:hover { border-color: rgba(212,160,39,0.3); }
        .event-category { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; font-family: var(--font-inter), sans-serif; }
        .event-date { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 6px; font-family: var(--font-inter), sans-serif; }
        .event-name { font-family: var(--font-inter), sans-serif; font-size: 14px; font-weight: 600; color: #FAF9F6; margin: 0 0 6px; }
        .event-location { font-size: 12px; color: rgba(255,255,255,0.45); margin: 0 0 10px; font-family: var(--font-inter), sans-serif; }
        .event-link { font-size: 12px; color: #D4A027; text-decoration: none; font-family: var(--font-inter), sans-serif; transition: opacity 0.2s; }
        .event-link:hover { opacity: 0.75; }

        .seasonal-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (max-width: 640px) { .seasonal-grid { grid-template-columns: 1fr; } }
        .seasonal-card { padding: 1.25rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; }
        .seasonal-month { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #D4A027; display: block; margin-bottom: 8px; font-family: var(--font-inter), sans-serif; }
        .seasonal-text { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; margin: 0; font-family: var(--font-inter), sans-serif; }
      `}</style>
    </section>
  );
}
