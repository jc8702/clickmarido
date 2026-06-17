import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardLineChart, DashboardBarChart } from '../charts';

// Mock Recharts to avoid DOM measuring errors in jsdom
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual<any>('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="recharts-mock" style={{ width: '100%', height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe('DashboardLineChart', () => {
  const data = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
  ];

  it('renders correctly', () => {
    render(<DashboardLineChart data={data} title="Line Chart" dataKey="value" />);
    expect(screen.getByTestId('recharts-mock')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    const { container } = render(
      <DashboardLineChart data={[]} title="Line Chart" dataKey="value" />,
    );
    expect(container).toBeInTheDocument();
  });
});

describe('DashboardBarChart', () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
  ];

  it('renders correctly', () => {
    render(<DashboardBarChart data={data} title="Bar Chart" dataKey="value" />);
    expect(screen.getByTestId('recharts-mock')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    const { container } = render(<DashboardBarChart data={[]} title="Bar Chart" dataKey="value" />);
    expect(container).toBeInTheDocument();
  });

  it('renders multiple charts simultaneously without crashing', () => {
    render(
      <div>
        <DashboardLineChart data={data} title="Line" dataKey="value" />
        <DashboardBarChart data={data} title="Bar" dataKey="value" />
      </div>,
    );
    expect(screen.getAllByTestId('recharts-mock')).toHaveLength(2);
  });
});
