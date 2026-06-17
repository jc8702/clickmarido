import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLineChart = dynamic(
  () => import('@/components/dashboard/charts').then((mod) => mod.DashboardLineChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
  },
);

const DashboardBarChart = dynamic(
  () => import('@/components/dashboard/charts').then((mod) => mod.DashboardBarChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
  },
);

export function ChartsSection() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-2 mt-8 animate-in-slide"
      style={{ animationDelay: '0.15s' }}
    >
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
  );
}
