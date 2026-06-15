'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useDashboardMetrics } from '@/app/(dashboard)/dashboard/use-dashboard-metrics';
import { useChartFilters } from '@/app/(dashboard)/dashboard/use-chart-filters';

interface DashboardContextData {
  metrics: ReturnType<typeof useDashboardMetrics>;
  filters: ReturnType<typeof useChartFilters>;
}

const DashboardContext = createContext<DashboardContextData | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const metrics = useDashboardMetrics();
  const filters = useChartFilters();

  return (
    <DashboardContext.Provider value={{ metrics, filters }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
