import {
  Users,
  Wrench,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Percent,
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { DashboardMetrics } from '@/app/(dashboard)/dashboard/use-dashboard-metrics';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

interface KpiGridProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
  isError: boolean;
}

export function KpiGrid({ metrics, isLoading, isError }: KpiGridProps) {
  if (isError) {
    return (
      <div className="col-span-full p-4 text-center text-red-500 bg-red-500/10 rounded-xl">
        Erro ao carregar dados executivos.
      </div>
    );
  }

  if (isLoading || !metrics) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900/50" />
        ))}
      </>
    );
  }

  return (
    <>
      <KpiCard
        title="Total de Leads"
        value={metrics.totalLeads}
        description="CRM Pipeline"
        icon={<Users className="w-5 h-5" />}
        trend={12}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Orçamentos Emitidos"
        value={metrics.totalQuotes}
        description="Propostas comerciais"
        icon={<FileText className="w-5 h-5" />}
        trend={5}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Taxa de Conversão"
        value={`${metrics.conversionRate}%`}
        description="Sucesso de vendas"
        icon={<Percent className="w-5 h-5" />}
        trend={-2}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Serviços Concluídos"
        value={metrics.completedOrders}
        description="Ordens finalizadas"
        icon={<CheckCircle2 className="w-5 h-5" />}
        trend={8}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Receita Total"
        value={formatCurrency(metrics.totalRevenue)}
        description="Faturamento Bruto"
        icon={<DollarSign className="w-5 h-5" />}
        trend={15}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Lucro Líquido"
        value={formatCurrency(metrics.totalProfit)}
        description="Receita - Despesa"
        icon={<TrendingUp className="w-5 h-5" />}
        trend={18}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Técnicos Ativos"
        value={metrics.activeTechs}
        description="Capacidade operacional"
        icon={<Wrench className="w-5 h-5" />}
        className="border-border/50 shadow-sm"
      />
      <KpiCard
        title="Garantias Vigentes"
        value={metrics.activeWarranties}
        description="Monitoramento Pós-venda"
        icon={<ShieldCheck className="w-5 h-5" />}
        className="border-border/50 shadow-sm"
      />
    </>
  );
}
