import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from '../kpi-card';

describe('KpiCard', () => {
  it('renders title and value', () => {
    render(<KpiCard title="Total Sales" value="1000" />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const FakeIcon = () => <svg data-testid="fake-icon" />;
    render(<KpiCard title="Users" value="50" icon={<FakeIcon />} />);
    expect(screen.getByTestId('fake-icon')).toBeInTheDocument();
  });

  it('renders positive trend correctly', () => {
    render(<KpiCard title="Growth" value="10%" trend={2} trendLabel="up" />);
    expect(screen.getByText('2%')).toBeInTheDocument();
  });

  it('renders negative trend correctly', () => {
    render(<KpiCard title="Loss" value="5" trend={-1} trendLabel="down" />);
    expect(screen.getByText('1%')).toBeInTheDocument(); // Math.abs(trend)
  });

  it('renders neutral trend correctly', () => {
    render(<KpiCard title="Stable" value="10" trend={0} trendLabel="neutral" />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
