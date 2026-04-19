'use client';

const ALL_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Props {
  bestMonths: string[];
}

export default function MonthCalendar({ bestMonths }: Props) {
  const bestSet = new Set(bestMonths.map((m) => m.toLowerCase()));

  return (
    <div className="month-calendar">
      <p className="month-cal-title">Best Time to Visit</p>
      <div className="month-grid">
        {ALL_MONTHS.map((month, i) => {
          const isHighlighted = bestSet.has(month.toLowerCase());
          return (
            <div
              key={month}
              title={month}
              className={`month-cell ${isHighlighted ? 'month-cell--active' : ''}`}
              aria-label={`${month}${isHighlighted ? ' — recommended' : ''}`}
            >
              {SHORT[i]}
            </div>
          );
        })}
      </div>

      <style>{`
        .month-cal-title {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
          font-family: var(--font-inter), sans-serif;
        }
        .month-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
        }
        .month-cell {
          font-size: 9px;
          font-weight: 600;
          text-align: center;
          padding: 5px 2px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: var(--font-inter), sans-serif;
          transition: all 0.2s;
        }
        .month-cell--active {
          background: rgba(212, 160, 39, 0.25);
          color: #D4A027;
          border: 1px solid rgba(212, 160, 39, 0.4);
        }
      `}</style>
    </div>
  );
}
