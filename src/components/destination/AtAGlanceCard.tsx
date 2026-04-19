'use client';
import { useState } from 'react';
import {
  Backpack, Coffee, Star, Cloud, Wind,
  Droplets, Navigation, Calendar,
} from 'lucide-react';
import type { Destination, WeatherData } from '@/lib/destination-types';
import MonthCalendar from './MonthCalendar';

interface Props {
  destination: Destination;
  weather?: WeatherData | null;
}

const CROWD_BAR: Record<string, number> = {
  very_low: 15, low: 30, medium: 50, high: 75, very_high: 95,
};

export default function AtAGlanceCard({ destination, weather }: Props) {
  const [nikosChatOpen, setNikosChatOpen] = useState(false);
  const { at_a_glance } = destination;
  const budget = at_a_glance?.avg_daily_budget;
  const crowdPct = CROWD_BAR[at_a_glance?.crowd_level ?? 'medium'];

  const openNikos = () => {
    document.dispatchEvent(new CustomEvent('open-nikos-guide', {
      detail: { destination: destination.name_en },
    }));
  };

  return (
    <aside className="glance-card glass-dark" aria-label="At a glance information">

      {/* Budget */}
      <div className="glance-section">
        <h3 className="glance-section-title">Daily Budget (€)</h3>
        <div className="budget-tiers">
          <div className="budget-tier">
            <Backpack size={16} className="budget-icon" />
            <div className="budget-tier-info">
              <span className="budget-tier-label">Backpacker</span>
              <span className="budget-tier-value">€{budget?.backpacker ?? '—'}</span>
            </div>
          </div>
          <div className="budget-tier">
            <Coffee size={16} className="budget-icon" />
            <div className="budget-tier-info">
              <span className="budget-tier-label">Comfortable</span>
              <span className="budget-tier-value">€{budget?.comfortable ?? '—'}</span>
            </div>
          </div>
          <div className="budget-tier">
            <Star size={16} className="budget-icon" />
            <div className="budget-tier-info">
              <span className="budget-tier-label">Luxury</span>
              <span className="budget-tier-value">€{budget?.luxury ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best months calendar */}
      <div className="glance-section">
        <MonthCalendar bestMonths={at_a_glance?.best_months ?? []} />
      </div>

      {/* Crowd level */}
      <div className="glance-section">
        <div className="crowd-header">
          <h3 className="glance-section-title">Crowd Level</h3>
          <span className="crowd-label">
            {at_a_glance?.crowd_level?.replace('_', ' ') ?? 'Unknown'}
          </span>
        </div>
        <div className="crowd-bar-track">
          <div
            className="crowd-bar-fill"
            style={{ width: `${crowdPct}%` }}
            role="progressbar"
            aria-valuenow={crowdPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Getting there */}
      {at_a_glance?.getting_there && (
        <div className="glance-section">
          <h3 className="glance-section-title">
            <Navigation size={13} style={{ display: 'inline', marginRight: 5 }} />
            Getting There
          </h3>
          <p className="glance-text">{at_a_glance.getting_there}</p>
        </div>
      )}

      {/* Weather widget */}
      {weather?.current ? (
        <div className="glance-section weather-widget">
          <h3 className="glance-section-title">
            <Cloud size={13} style={{ display: 'inline', marginRight: 5 }} />
            Current Weather
          </h3>
          <div className="weather-current">
            <span className="weather-emoji" role="img" aria-label={weather.current.description}>
              {weather.current.icon}
            </span>
            <div>
              <span className="weather-temp">{Math.round(weather.current.temp)}°C</span>
              <span className="weather-desc">{weather.current.description}</span>
            </div>
            <div className="weather-meta">
              <span><Droplets size={11} /> {weather.current.humidity}%</span>
              <span><Wind size={11} /> {Math.round(weather.current.wind_speed)} m/s</span>
            </div>
          </div>
          {weather.forecast?.length > 0 && (
            <div className="weather-forecast">
              {weather.forecast.slice(0, 5).map((day) => (
                <div key={day.date} className="forecast-day">
                  <span className="forecast-date">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                  <span className="forecast-emoji" role="img" aria-label={day.description}>{day.icon}</span>
                  <span className="forecast-range">{Math.round(day.temp_min)}°–{Math.round(day.temp_max)}°</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glance-section glance-weather-na">
          <Cloud size={16} opacity={0.3} />
          <span>Weather data unavailable</span>
        </div>
      )}

      {/* CTA */}
      <button
        className="glance-cta"
        onClick={openNikos}
        aria-label="Open AI travel guide for this destination"
      >
        Plan this trip with Nikos →
      </button>

      <style>{`
        .glance-card {
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: sticky;
          top: 90px;
        }
        .glance-section {
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .glance-section:last-of-type { border-bottom: none; }
        .glance-section-title {
          font-family: var(--font-inter), sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin: 0 0 10px;
        }
        .glance-text {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.65;
          margin: 0;
          font-family: var(--font-inter), sans-serif;
        }

        /* Budget */
        .budget-tiers { display: flex; flex-direction: column; gap: 10px; }
        .budget-tier { display: flex; align-items: center; gap: 10px; }
        .budget-icon { color: #D4A027; flex-shrink: 0; }
        .budget-tier-info { display: flex; justify-content: space-between; flex: 1; }
        .budget-tier-label { font-size: 12px; color: rgba(255,255,255,0.6); font-family: var(--font-inter), sans-serif; }
        .budget-tier-value { font-size: 13px; font-weight: 600; color: #FAF9F6; font-family: var(--font-inter), sans-serif; }

        /* Crowd */
        .crowd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .crowd-label { font-size: 11px; font-weight: 600; color: #D4A027; text-transform: capitalize; font-family: var(--font-inter), sans-serif; }
        .crowd-bar-track { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .crowd-bar-fill { height: 100%; background: linear-gradient(90deg, #D4A027, #C1440E); border-radius: 3px; transition: width 1s ease; }

        /* Weather */
        .weather-current { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .weather-emoji { font-size: 2.4rem; line-height: 1; filter: drop-shadow(0 0 4px rgba(212,160,39,0.2)); }
        .forecast-emoji { font-size: 1.2rem; line-height: 1; }
        .weather-temp { font-size: 1.6rem; font-weight: 300; color: #FAF9F6; display: block; font-family: var(--font-serif), serif; }
        .weather-desc { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: capitalize; display: block; }
        .weather-meta { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.5); margin-left: auto; }
        .weather-meta span { display: flex; align-items: center; gap: 4px; }
        .weather-forecast { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
        .forecast-day { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
        .forecast-date { font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.45); font-family: var(--font-inter), sans-serif; }
        .forecast-range { font-size: 10px; color: rgba(255,255,255,0.65); font-family: var(--font-inter), sans-serif; white-space: nowrap; }
        .glance-weather-na { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.3); font-size: 12px; font-family: var(--font-inter), sans-serif; }

        /* CTA */
        .glance-cta {
          margin-top: 1.25rem;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #D4A027, #C1440E);
          color: #0A1628;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          font-family: var(--font-inter), sans-serif;
        }
        .glance-cta:hover { opacity: 0.9; transform: translateY(-1px); }
        .glance-cta:active { transform: translateY(0); }
      `}</style>
    </aside>
  );
}
