'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from './dashboard-layout';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  Users,
  Wrench,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
  UserCheck,
  CalendarDays,
  HardHat,
  ClipboardList,
  Package,
  MessageSquare,
  DollarSign,
  Shield,
  HeartHandshake,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign, permission: 'financial:read' },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3, permission: 'financial:read' },
  { href: '/clientes', label: 'Clientes', icon: Users, permission: 'client:read' },
  { href: '/conversas', label: 'Conversas', icon: MessageSquare, permission: 'whatsapp:read' },
  { href: '/servicos', label: 'Serviços', icon: Wrench, permission: 'service:read' },
  { href: '/materiais', label: 'Materiais', icon: Package, permission: 'material:read' },
  { href: '/tecnicos', label: 'Técnicos', icon: HardHat, permission: 'technician:read' },
  {
    href: '/ordens-servico',
    label: 'Ordens de Serviço',
    icon: ClipboardList,
    permission: 'service:read',
  },
  { href: '/garantias', label: 'Garantias', icon: Shield, permission: 'service:read' },
  { href: '/pos-venda', label: 'Pós-Venda', icon: HeartHandshake, permission: 'service:read' },
  { href: '/orcamentos', label: 'Orçamentos', icon: FileText, permission: 'quote:read' },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays, permission: 'service:read' },
  { href: '/empresas', label: 'Empresas', icon: Building, permission: '*' },
  { href: '/usuarios', label: 'Usuários', icon: UserCheck, permission: 'user:read' },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useLayout();

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.permission) return true;
    if (!user) return false;
    return user.permissions.includes(item.permission) || user.permissions.includes('*');
  });

  return (
    <>
      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col glass-panel border-r border-[var(--border)] transition-all duration-300 ease-in-out md:static',
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0',
          sidebarCollapsed ? 'md:w-20' : 'md:w-64',
        )}
        style={{ background: 'color-mix(in srgb, var(--card) 80%, transparent)' }}
      >
        {/* LOGO */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg select-none">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-black shadow-md shrink-0"
              style={{
                boxShadow: '0 4px 14px color-mix(in srgb, var(--primary) 30%, transparent)',
              }}
            >
              CM
            </span>
            <span
              className={cn(
                'transition-all duration-300 font-semibold tracking-wide truncate text-[var(--foreground)]',
                sidebarCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100',
              )}
            >
              Click <span style={{ color: 'var(--primary)' }}>Marido</span>
            </span>
          </Link>

          <button
            className="rounded-lg p-1.5 hover:bg-[var(--border)] md:hidden text-[var(--foreground)]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group',
                  isActive
                    ? 'text-[var(--primary-foreground)] shadow-md'
                    : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--border)]/60',
                )}
                style={
                  isActive
                    ? {
                        background: 'var(--primary)',
                        boxShadow: '0 4px 14px color-mix(in srgb, var(--primary) 20%, transparent)',
                      }
                    : {}
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-[var(--primary-foreground)]' : '',
                  )}
                />

                <span
                  className={cn(
                    'transition-all duration-300 truncate',
                    sidebarCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100',
                  )}
                >
                  {item.label}
                </span>

                {sidebarCollapsed && (
                  <div
                    className="absolute left-16 hidden rounded-lg border border-[var(--border)] px-2 py-1 text-xs shadow-md group-hover:md:block z-50"
                    style={{ background: 'var(--card)', color: 'var(--foreground)' }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER TOGGLE */}
        <div className="p-3 border-t border-[var(--border)] hidden md:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex w-full items-center justify-center rounded-xl py-2 transition-colors text-[var(--foreground)]/50 hover:text-[var(--foreground)] hover:bg-[var(--border)]/60"
            aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold select-none">
                <ChevronLeft className="h-5 w-5" />
                <span>Recolher Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
