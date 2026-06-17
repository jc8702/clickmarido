'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardView = dynamic(() => import('./dashboard-view'), {
  ssr: false,
  loading: () => (
    <div className="p-8">
      <Skeleton className="w-full h-[calc(100vh-4rem)] rounded-xl" />
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardView />;
}
