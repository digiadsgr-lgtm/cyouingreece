'use client';
import { useEffect } from 'react';
import { useUserHistory } from '@/lib/useUserHistory';

interface Props {
  slug: string;
  type: string;
}

export default function HistoryTracker({ slug, type }: Props) {
  const { trackVisit } = useUserHistory();

  useEffect(() => {
    trackVisit(slug, type);
  }, [slug, type]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
