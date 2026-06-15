'use client';

import { TrendingUp, Plus, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { useDashboardMetrics } from './use-dashboard-metrics';
import { KpiGrid } from '@/components/dashboard/kpi-grid';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { ActionCards } from '@/components/dashboard/action-cards';

export default function DashboardView() {
  const { metrics, isLoading, isError } = useDashboardMetrics();

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in-fade">
      <PageHeader
        title="Painel Executivo"
        subtitle="Visão de alto nível sobre funil de vendas, faturamento e qualidade técnica da empresa."
        icon={<TrendingUp className="w-8 h-8" />}
        iconBg="bg-accent/10 text-accent"
        badge={{ label: "● Executivo em Tempo Real", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" }}
        actions={[
          {
            label: "Novo Lead",
            href: "/clientes",
            icon: <Plus className="w-5 h-5" />,
            className: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg",
          },
          {
            label: "Novo Orçamento",
            href: "/orcamentos",
            variant: "outline",
            icon: <FileText className="w-5 h-5" />,
            className: "border-border bg-input/40 hover:bg-input/80 text-foreground",
          },
        ]}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in-slide" style={{ animationDelay: '0.1s' }}>
        <KpiGrid metrics={metrics} isLoading={isLoading} isError={isError} />
      </div>

      <ChartsSection />
      <ActionCards />
    </div>
  );
}
