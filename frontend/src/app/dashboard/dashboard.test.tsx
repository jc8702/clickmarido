import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import useSWR from 'swr';
import { vi, expect, test } from 'vitest';

vi.mock('swr', () => ({
  default: vi.fn(),
}));

vi.mock('@/lib/api-reports', () => ({
  getExecutiveDashboard: vi.fn(),
}));

test('renders dashboard loaders in isLoading state', () => {
  (useSWR as any).mockReturnValue({
    data: null,
    error: null,
    isLoading: true,
  });

  const { container } = render(<DashboardPage />);
  
  // Deve conter esqueletos rodando pulsação
  const skeletons = container.querySelectorAll('.animate-pulse');
  expect(skeletons.length).toBeGreaterThan(0);
});

test('renders error state warning on API failure', () => {
  (useSWR as any).mockReturnValue({
    data: null,
    error: new Error('Internal Server Error'),
    isLoading: false,
  });

  render(<DashboardPage />);
  expect(screen.getByText(/erro ao carregar dados executivos/i)).toBeInTheDocument();
});

test('renders all 8 KPIs with correct real values from API', () => {
  const mockData = {
    totalLeads: 25,
    totalQuotes: 12,
    conversionRate: 67,
    completedOrders: 8,
    totalRevenue: 2450.50,
    totalProfit: 1890.00,
    activeTechs: 4,
    activeWarranties: 3,
  };

  (useSWR as any).mockReturnValue({
    data: mockData,
    error: null,
    isLoading: false,
  });

  render(<DashboardPage />);

  // KPIs
  expect(screen.getByText('25')).toBeInTheDocument();
  expect(screen.getByText('12')).toBeInTheDocument();
  expect(screen.getByText('67%')).toBeInTheDocument();
  expect(screen.getByText('8')).toBeInTheDocument();
  expect(screen.getByText('R$ 2.450,50')).toBeInTheDocument();
  expect(screen.getByText('R$ 1.890,00')).toBeInTheDocument();
  expect(screen.getByText('4')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});
