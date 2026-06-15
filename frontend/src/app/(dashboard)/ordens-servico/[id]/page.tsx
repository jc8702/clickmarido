'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ServiceOrder, getServiceOrder } from '@/lib/api/modules/service-orders';
import { ServiceOrderExecution } from '@/components/service-orders/service-order-execution';
import Link from 'next/link';

export default function OSEjecucaoPage() {
  const { id } = useParams() as { id: string };
  const [os, setOs] = useState<ServiceOrder | null>(null);

  const fetchData = async () => {
    try {
      const data = await getServiceOrder(id);
      setOs(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (!os) return <div className="p-8">Carregando...</div>;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/ordens-servico" className="text-muted-foreground hover:text-foreground">
          &larr; Voltar
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Execução da OS #{os.number}</h2>
      </div>

      <ServiceOrderExecution os={os} onUpdate={fetchData} />
    </div>
  );
}
