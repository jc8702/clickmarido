'use client';

import { Users, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ClientProvider, useClientContext } from '@/contexts/client-context';
import { ClientsFilters } from '@/components/clientes/clients-filters';
import { ClientsTable } from '@/components/clientes/clients-table';
import dynamic from 'next/dynamic';

const ClientFormModal = dynamic(
  () => import('@/components/clientes/client-form-modal').then((m) => m.ClientFormModal),
  { ssr: false },
);
const ClientHistoryModal = dynamic(
  () => import('@/components/clientes/client-history-modal').then((m) => m.ClientHistoryModal),
  { ssr: false },
);

function ClientesView() {
  const { data, handleOpenCreateModal } = useClientContext();
  const { total } = data;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      <PageHeader
        title="Clientes"
        subtitle={`Gerenciando ${total} contatos cadastrados no CRM`}
        icon={<Users className="w-8 h-8" />}
        breadcrumbs={[{ label: 'Clientes' }]}
        actions={[
          {
            label: 'Novo Cliente',
            icon: <Plus className="w-5 h-5" />,
            onClick: handleOpenCreateModal,
            className: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg',
          },
        ]}
      />

      <ClientsFilters />
      <ClientsTable />

      <ClientFormModal />
      <ClientHistoryModal />
    </div>
  );
}

export default function ClientesPage() {
  return (
    <ClientProvider>
      <ClientesView />
    </ClientProvider>
  );
}
