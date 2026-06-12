'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  className?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  badge?: {
    label: string;
    className?: string;
  };
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageHeaderAction[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  iconBg = 'bg-primary/10 text-primary',
  badge,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8',
        className
      )}
    >
      <div className="space-y-2">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-zinc-700" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-zinc-400">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Badge de status */}
        {badge && (
          <Badge
            variant="outline"
            className={cn('w-fit text-[10px] font-bold uppercase tracking-wider', badge.className)}
          >
            {badge.label}
          </Badge>
        )}

        {/* Título */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
          {icon && (
            <div className={cn('p-2 rounded-2xl shrink-0', iconBg)}>
              {icon}
            </div>
          )}
          {title}
        </h1>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-zinc-400 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Ações */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-3 shrink-0">
          {actions.map((action, idx) => {
            const btnContent = (
              <>
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </>
            );

            if (action.href) {
              return (
                <Link key={idx} href={action.href}>
                  <Button
                    variant={action.variant ?? 'default'}
                    className={cn('h-11 px-6 rounded-xl font-bold transition-all hover:scale-105', action.className)}
                  >
                    {btnContent}
                  </Button>
                </Link>
              );
            }

            return (
              <Button
                key={idx}
                variant={action.variant ?? 'default'}
                onClick={action.onClick}
                className={cn('h-11 px-6 rounded-xl font-bold transition-all hover:scale-105', action.className)}
              >
                {btnContent}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
