import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard'
}));

vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({ user: { name: 'Test User', permissions: ['*'] }, logout: vi.fn() })
}));

vi.mock('@/components/layout/dashboard-layout', () => ({
  useLayout: () => ({ 
    sidebarOpen: true, 
    setSidebarOpen: vi.fn(), 
    sidebarCollapsed: false,
    setSidebarCollapsed: vi.fn() 
  })
}));

describe('Sidebar', () => {
  it('renders correctly', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Agenda')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Empresas')).toBeInTheDocument();
  });

  it('applies active class to current path', () => {
    render(<Sidebar />);
    const activeLink = screen.getByText('Painel').closest('a');
    expect(activeLink).toHaveClass('shadow-md');
  });

  it('renders settings link', () => {
    render(<Sidebar />);
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: /click marido/i })).toBeInTheDocument();
  });
});
