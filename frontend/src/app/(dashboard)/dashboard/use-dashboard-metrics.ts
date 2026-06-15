import useSWR from 'swr';
import { getExecutiveDashboard } from '@/lib/api/modules/reports';

export interface DashboardMetrics {
  totalLeads: number;
  totalQuotes: number;
  conversionRate: number;
  completedOrders: number;
  totalRevenue: number;
  totalProfit: number;
  activeTechs: number;
  activeWarranties: number;
}

export const useDashboardMetrics = () => {
  const { data, error, isLoading } = useSWR<DashboardMetrics>(
    '/reports/dashboard',
    getExecutiveDashboard,
    {
      refreshInterval: 5000, // Real-time pooling a cada 5 segundos
    }
  );

  return {
    metrics: data,
    isLoading,
    isError: !!error,
  };
};
