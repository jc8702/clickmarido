import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './filter-panel';
import { expect, test, describe, vi } from 'vitest';

describe('FilterPanel', () => {
  test('renders search input and calls onSearchChange', () => {
    const onSearchChange = vi.fn();
    render(<FilterPanel search="foo" onSearchChange={onSearchChange} searchPlaceholder="Busca test" />);
    
    const input = screen.getByLabelText('Busca test');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('foo');

    fireEvent.change(input, { target: { value: 'bar' } });
    expect(onSearchChange).toHaveBeenCalledWith('bar');
  });

  test('renders filters and calls onFilterChange', () => {
    const onFilterChange = vi.fn();
    const filters = [
      { id: 'status', label: 'Status', options: [{ label: 'Ativo', value: 'ativo' }] }
    ];
    
    render(
      <FilterPanel 
        search="" 
        onSearchChange={() => {}} 
        filters={filters} 
        activeFilters={{ status: '' }} 
        onFilterChange={onFilterChange} 
      />
    );
    
    const select = screen.getByLabelText('Status');
    expect(select).toBeInTheDocument();
    
    fireEvent.change(select, { target: { value: 'ativo' } });
    expect(onFilterChange).toHaveBeenCalledWith('status', 'ativo');
  });

  test('renders date range and calls onDateRangeChange', () => {
    const onDateRangeChange = vi.fn();
    render(
      <FilterPanel 
        search="" 
        onSearchChange={() => {}} 
        showDateRange={true}
        dateRange={{ from: '2023-01-01', to: '2023-01-31' }}
        onDateRangeChange={onDateRangeChange}
      />
    );
    
    const fromInput = screen.getByLabelText('Data inicial');
    const toInput = screen.getByLabelText('Data final');
    
    expect(fromInput).toHaveValue('2023-01-01');
    expect(toInput).toHaveValue('2023-01-31');
    
    fireEvent.change(fromInput, { target: { value: '2023-02-01' } });
    expect(onDateRangeChange).toHaveBeenCalledWith({ from: '2023-02-01', to: '2023-01-31' });

    fireEvent.change(toInput, { target: { value: '2023-02-28' } });
    expect(onDateRangeChange).toHaveBeenCalledWith({ from: '2023-01-01', to: '2023-02-28' });
  });

  test('calls onClearFilters when clear button is clicked', () => {
    const onClearFilters = vi.fn();
    const filters = [{ id: 'status', label: 'Status', options: [{ label: 'Ativo', value: 'ativo' }] }];
    
    render(
      <FilterPanel 
        search="" 
        onSearchChange={() => {}} 
        filters={filters} 
        activeFilters={{ status: 'ativo' }} 
        onClearFilters={onClearFilters} 
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /Limpar/i });
    fireEvent.click(clearButton);
    expect(onClearFilters).toHaveBeenCalled();
  });
});
