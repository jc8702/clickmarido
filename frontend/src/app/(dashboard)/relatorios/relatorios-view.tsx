'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCommercialReport, getOperationalReport, getFinancialReport, CommercialReport, OperationalReport, FinancialReport } from '@/lib/api/modules/reports';
import { BarChart3, TrendingUp, Users, DollarSign, Wallet, Percent, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';

const CommercialChart = dynamic(() => import('@/components/reports/charts').then(mod => mod.CommercialChart), { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-xl" /> });
const OperationalChart = dynamic(() => import('@/components/reports/charts').then(mod => mod.OperationalChart), { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-xl" /> });
const FinancialChart = dynamic(() => import('@/components/reports/charts').then(mod => mod.FinancialChart), { ssr: false, loading: () => <Skeleton className="h-[350px] w-full rounded-xl" /> });


export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<'commercial' | 'operational' | 'financial'>('commercial');
  const [commercial, setCommercial] = useState<CommercialReport | null>(null);
  const [operational, setOperational] = useState<OperationalReport | null>(null);
  const [financial, setFinancial] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [c, o, f] = await Promise.all([
          getCommercialReport(),
          getOperationalReport(),
          getFinancialReport()
        ]);
        setCommercial(c);
        setOperational(o);
        setFinancial(f);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Carregando métricas e montando gráficos...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-in-fade">
      <PageHeader
        title="Relatórios e Dashboards"
        subtitle="Visão consolidada da operação, comercial e financeiro."
        icon={<BarChart3 className="w-8 h-8" />}
        iconBg="bg-primary/10 text-primary"
      />

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-md max-w-md">
        <button 
          onClick={() => setActiveTab('commercial')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${activeTab === 'commercial' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
        >
          <TrendingUp className="w-4 h-4" /> Comercial
        </button>
        <button 
          onClick={() => setActiveTab('operational')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${activeTab === 'operational' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
        >
          <Users className="w-4 h-4" /> Operacional
        </button>
        <button 
          onClick={() => setActiveTab('financial')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${activeTab === 'financial' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
        >
          <DollarSign className="w-4 h-4" /> Financeiro
        </button>
      </div>

      {/* Tab Content: Comercial */}
      {activeTab === 'commercial' && commercial && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Conversão (Orçamentos)</h3>
                <Percent className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">{commercial.conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{commercial.approvedQuotes} de {commercial.totalQuotes} orçamentos viraram OS</p>
            </div>
            
            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Ticket Médio</h3>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">R$ {commercial.ticketMedio.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Baseado em {commercial.completedOrders} ordens concluídas</p>
            </div>

            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Serviços Vendidos</h3>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">{commercial.topServices.reduce((a, b) => a + b.value, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de itens faturados (Top 5)</p>
            </div>
          </div>

          <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6">Top 5 Serviços Mais Vendidos</h3>
            <div className="h-[300px] w-full">
              <CommercialChart data={commercial.topServices} />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Operacional */}
      {activeTab === 'operational' && operational && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Tempo Médio de Conclusão</h3>
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">{operational.avgTimeDays} dias</div>
              <p className="text-xs text-muted-foreground mt-1">Média entre a criação e conclusão da OS</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-6">Produtividade por Técnico (OS Concluídas)</h3>
              <div className="h-[300px] w-full">
                <OperationalChart data={operational.productivity} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Financeiro */}
      {activeTab === 'financial' && financial && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Receita Bruta</h3>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">R$ {financial.totalIncome.toFixed(2)}</div>
            </div>
            
            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Despesas</h3>
              </div>
              <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">R$ {financial.totalExpense.toFixed(2)}</div>
            </div>

            <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Lucro Líquido</h3>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${financial.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                R$ {financial.netProfit.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="glass-card border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6">DRE Mensal - Receitas vs Despesas</h3>
            <div className="h-[350px] w-full">
              <FinancialChart data={financial.chartData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
