'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceOrder, getServiceOrders } from '@/lib/api-service-orders';
import { format } from 'date-fns';

const COMPANY_ID = "6fb48ab0-08ab-49bd-9eab-57dd4f923ff1"; // MOCK for MVP

export default function OrdensServicoPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceOrders(COMPANY_ID)
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h2>
      </div>

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">OS #</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Técnico</th>
              <th className="px-4 py-3">Agendamento</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {loading ? (
               <tr><td colSpan={6} className="px-4 py-4 text-center">Carregando...</td></tr>
            ) : orders.length === 0 ? (
               <tr><td colSpan={6} className="px-4 py-4 text-center">Nenhuma ordem encontrada. Vá em Orçamentos e gere uma!</td></tr>
            ) : (
              orders.map(os => (
                <tr key={os.id} className="border-t">
                  <td className="px-4 py-3 font-medium">#{os.number}</td>
                  <td className="px-4 py-3">{os.client?.name || '-'}</td>
                  <td className="px-4 py-3">{os.technician?.name || 'Não atribuído'}</td>
                  <td className="px-4 py-3">
                    {os.scheduledAt ? format(new Date(os.scheduledAt), 'dd/MM/yyyy HH:mm') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${os.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/ordens-servico/${os.id}`} className="text-primary hover:underline">
                      Abrir Execução
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
