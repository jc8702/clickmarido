'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { getExecutiveDashboard } from '@/lib/api-reports';
import {
  Users,
  Wrench,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  DollarSign,
  ShieldCheck,
  Percent,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { DashboardLineChart, DashboardBarChart } from '@/components/dashboard/charts';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function DashboardPage() {
  const { data: stats, error, isLoading } = useSWR('/reports/dashboard', getExecutiveDashboard, {
    refreshInterval: 5000, // Real-time pooling a cada 5 segundos
  });

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

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in-slide" style={{ animationDelay: '0.1s' }}>
        {error ? (
          <div className="col-span-full p-4 text-center text-red-500 bg-red-500/10 rounded-xl">
            Erro ao carregar dados executivos.
          </div>
        ) : isLoading || !stats ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900/50" />
          ))
        ) : (
          <>
            <KpiCard title="Total de Leads" value={stats.totalLeads} description="CRM Pipeline" icon={<Users className="w-5 h-5" />} trend={12} className="border-border/50 shadow-sm" />
            <KpiCard title="Orçamentos Emitidos" value={stats.totalQuotes} description="Propostas comerciais" icon={<FileText className="w-5 h-5" />} trend={5} className="border-border/50 shadow-sm" />
            <KpiCard title="Taxa de Conversão" value={`${stats.conversionRate}%`} description="Sucesso de vendas" icon={<Percent className="w-5 h-5" />} trend={-2} className="border-border/50 shadow-sm" />
            <KpiCard title="Serviços Concluídos" value={stats.completedOrders} description="Ordens finalizadas" icon={<CheckCircle2 className="w-5 h-5" />} trend={8} className="border-border/50 shadow-sm" />
            <KpiCard title="Receita Total" value={formatCurrency(stats.totalRevenue)} description="Faturamento Bruto" icon={<DollarSign className="w-5 h-5" />} trend={15} className="border-border/50 shadow-sm" />
            <KpiCard title="Lucro Líquido" value={formatCurrency(stats.totalProfit)} description="Receita - Despesa" icon={<TrendingUp className="w-5 h-5" />} trend={18} className="border-border/50 shadow-sm" />
            <KpiCard title="Técnicos Ativos" value={stats.activeTechs} description="Capacidade operacional" icon={<Wrench className="w-5 h-5" />} className="border-border/50 shadow-sm" />
            <KpiCard title="Garantias Vigentes" value={stats.activeWarranties} description="Monitoramento Pós-venda" icon={<ShieldCheck className="w-5 h-5" />} className="border-border/50 shadow-sm" />
          </>
        )}
      </div>

      {/* Gráficos Recharts */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8 animate-in-slide" style={{ animationDelay: '0.15s' }}>
        <DashboardLineChart 
          title="Receita Mensal (Estimada)" 
          data={[
            { name: 'Jan', receita: 12000 },
            { name: 'Fev', receita: 15000 },
            { name: 'Mar', receita: 14000 },
            { name: 'Abr', receita: 18000 },
            { name: 'Mai', receita: 22000 },
            { name: 'Jun', receita: 25000 },
          ]} 
          dataKey="receita" 
          color="var(--primary)" 
        />
        <DashboardBarChart 
          title="Top Serviços Realizados" 
          data={[
            { name: 'Elétrica', total: 45 },
            { name: 'Hidráulica', total: 30 },
            { name: 'Pintura', total: 20 },
            { name: 'Montagem', total: 15 },
            { name: 'Geral', total: 10 },
          ]} 
          dataKey="total" 
          color="var(--accent)" 
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mt-8 animate-in-slide" style={{ animationDelay: '0.2s' }}>
          <Card className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[200px] border-border/50">
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20 mb-4">Saúde Financeira</Badge>
                <h3 className="text-2xl font-bold">Relatório Completo</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Analise o fluxo de caixa, as despesas corporativas e a margem de contribuição.
                </p>
              </div>
              <Link href="/relatorios">
                <Button className="w-fit mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">Acessar Relatórios <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </CardContent>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <TrendingUp className="w-64 h-64 -mb-16 -mr-16" />
            </div>
          </Card>

          <Card className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[200px] border-border/50">
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20 mb-4">Pipeline de Vendas</Badge>
                <h3 className="text-2xl font-bold">Gerir Orçamentos</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Acompanhe aprovações, envie cobranças e converta orçamentos em ordens ativas.
                </p>
              </div>
              <Link href="/orcamentos">
                <Button className="w-fit mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">Ver Pipeline <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </CardContent>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <FileText className="w-64 h-64 -mb-16 -mr-16" />
            </div>
          </Card>
      </div>
    </div>
  );
}
