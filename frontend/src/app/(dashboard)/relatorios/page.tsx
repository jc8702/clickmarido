'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const RelatoriosView = dynamic(() => import('./relatorios-view'), {
  ssr: false,
  loading: () => <div className="p-8"><Skeleton className="w-full h-[calc(100vh-4rem)] rounded-xl" /></div>
});

export default function RelatoriosPage() {
  return <RelatoriosView />;
}
