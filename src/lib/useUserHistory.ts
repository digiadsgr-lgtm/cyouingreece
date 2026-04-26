'use client';
import { useEffect, useState } from 'react';

const HISTORY_KEY = 'cyg_user_history';

export interface ViewHistory {
  slugs: string[];
  types: Record<string, number>; // counts frequency of destination types (e.g. 'island': 3, 'mountain': 1)
}

const DEFAULT_HISTORY: ViewHistory = { slugs: [], types: {} };

export function useUserHistory() {
  const [history, setHistory] = useState<ViewHistory>(DEFAULT_HISTORY);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse user history', e);
    }
    setIsLoaded(true);
  }, []);

  const trackVisit = (slug: string, type: string) => {
    try {
      setHistory(prev => {
        const newSlugs = [slug, ...prev.slugs.filter(s => s !== slug)].slice(0, 10); // Keep last 10
        const newTypes = { ...prev.types };
        if (type) {
          newTypes[type] = (newTypes[type] || 0) + 1;
        }
        const updated = { slugs: newSlugs, types: newTypes };
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save user history', e);
    }
  };

  const getTopInterest = (): string | null => {
    if (!history.types || Object.keys(history.types).length === 0) return null;
    return Object.entries(history.types).sort((a, b) => b[1] - a[1])[0][0];
  };

  return { history, isLoaded, trackVisit, getTopInterest };
}
