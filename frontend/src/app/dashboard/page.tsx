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
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12 bg-gradient-to-br from-blue-950 via-zinc-900 to-zinc-950 border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] -z-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-xs font-bold tracking-wider uppercase flex items-center w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Executivo em Tempo Real
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Painel <span className="gradient-text">Executivo</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
              Visão de alto nível sobre funil de vendas, faturamento e qualidade técnica da empresa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/clientes">
              <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Novo Lead
              </Button>
            </Link>
            <Link href="/orcamentos">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 font-bold transition-all hover:scale-105 backdrop-blur-sm">
                <FileText className="w-5 h-5 mr-2" />
                Novo Orçamento
              </Button>
            </Link>
          </div>
        </div>
      </div>

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
            {[
              { label: 'Total de Leads', value: stats.totalLeads, sub: 'CRM Pipeline', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'Orçamentos Emitidos', value: stats.totalQuotes, sub: 'Propostas comerciais', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Taxa de Conversão', value: `${stats.conversionRate}%`, sub: 'Sucesso de vendas', icon: Percent, color: 'text-pink-400', bg: 'bg-pink-500/10' },
              { label: 'Serviços Concluídos', value: stats.completedOrders, sub: 'Ordens finalizadas', icon: CheckCircle2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { label: 'Receita Total', value: formatCurrency(stats.totalRevenue), sub: 'Faturamento Bruto', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Lucro Líquido', value: formatCurrency(stats.totalProfit), sub: 'Receita - Despesa', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Técnicos Ativos', value: stats.activeTechs, sub: 'Capacidade operacional', icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Garantias Vigentes', value: stats.activeWarranties, sub: 'Monitoramento Pós-venda', icon: ShieldCheck, color: 'text-sky-400', bg: 'bg-sky-500/10' },
            ].map((kpi, idx) => (
              <Card key={idx} className="group glass-card glow-hover border-zinc-200/50 dark:border-zinc-900/50 overflow-hidden relative">
                <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-20 transition-opacity group-hover:opacity-40", kpi.bg)} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">{kpi.label}</CardTitle>
                  <div className={cn("p-2 rounded-lg", kpi.bg)}>
                    <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">{kpi.value}</div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">{kpi.sub}</p>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mt-8 animate-in-slide" style={{ animationDelay: '0.2s' }}>
          <Card className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[200px] border-zinc-200/50 dark:border-zinc-900/50">
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-4">Saúde Financeira</Badge>
                <h3 className="text-2xl font-bold">Relatório Completo</h3>
                <p className="text-zinc-500 mt-2 max-w-sm">
                  Analise o fluxo de caixa, as despesas corporativas e a margem de contribuição.
                </p>
              </div>
              <Link href="/relatorios">
                <Button className="w-fit mt-6 bg-emerald-600 hover:bg-emerald-700">Acessar Relatórios <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </CardContent>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <TrendingUp className="w-64 h-64 -mb-16 -mr-16" />
            </div>
          </Card>

          <Card className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[200px] border-zinc-200/50 dark:border-zinc-900/50">
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 mb-4">Pipeline de Vendas</Badge>
                <h3 className="text-2xl font-bold">Gerir Orçamentos</h3>
                <p className="text-zinc-500 mt-2 max-w-sm">
                  Acompanhe aprovações, envie cobranças e converta orçamentos em ordens ativas.
                </p>
              </div>
              <Link href="/orcamentos">
                <Button className="w-fit mt-6 bg-blue-600 hover:bg-blue-700">Ver Pipeline <ArrowRight className="w-4 h-4 ml-2" /></Button>
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
