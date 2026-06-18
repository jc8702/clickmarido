import { renderHook } from '@testing-library/react';
import { useDashboardMetrics } from './use-dashboard-metrics';

// Mock das dependências
vi.mock('@/lib/api/client');
vi.mock('sonner');
vi.mock('@/lib/api/errors');

const mockGetExecutiveDashboard = vi.mocked(require('@/lib/api/client').ApiClient.get);

describe('useDashboardMetrics', () => {
  it('should load dashboard metrics successfully', () => {
    const mockMetrics = {
      totalLeads: 10,
      totalQuotes: 5,
      conversionRate: 40,
      completedOrders: 3,
      totalRevenue: 1000,
      totalProfit: 800,
      activeTechs: 2,
      activeWarranties: 1,
    };

    mockGetExecutiveDashboard.mockResolvedValue(mockMetrics);

    const { result } = renderHook(() => useDashboardMetrics());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.metrics).toBeUndefined();
  });

  it('should handle null conversion rate', () => {
    const mockMetrics = {
      totalLeads: 10,
      totalQuotes: 0,
      conversionRate: null,
      completedOrders: 3,
      totalRevenue: 1000,
      totalProfit: 800,
      activeTechs: 2,
      activeWarranties: 1,
    };

    mockGetExecutiveDashboard.mockResolvedValue(mockMetrics);

    const { result } = renderHook(() => useDashboardMetrics());

    expect(result.current.metrics?.conversionRate).toBeNull();
  });
});