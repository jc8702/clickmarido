'use client';

import { useState } from 'react';

export function useChartFilters() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [category, setCategory] = useState<string>('all');

  return {
    dateRange,
    setDateRange,
    category,
    setCategory,
  };
}
