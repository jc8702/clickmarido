'use client';

import { useState, useEffect } from 'react';
import {
  Technician,
  getTechnicians,
  getTechnicianRanking,
  deleteTechnician,
} from '@/lib/api/modules/technicians';
import { TechniciansTable } from '@/components/technicians/technicians-table';
import { TechnicianForm } from '@/components/technicians/technician-form';
import { TechnicianAnalytics } from '@/components/technicians/technician-analytics';
import { useAuth } from '@/contexts/auth-context';
import { PageHeader } from '@/components/layout/page-header';
import { HardHat, Plus } from 'lucide-react';

import useSWR from 'swr';

export default function TecnicosPage() {
  const { company } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);

  const { data: techData, mutate: mutateTech } = useSWR(
    company ? ['technicians', company.id] : null,
    ([_, id]) => getTechnicians(id),
    { keepPreviousData: true, dedupingInterval: 300000 },
  );

  const { data: rankData, mutate: mutateRank } = useSWR(
    company ? ['technicians-ranking', company.id] : null,
    ([_, id]) => getTechnicianRanking(id),
    { keepPreviousData: true, dedupingInterval: 300000 },
  );

  const technicians = techData || [];
  const ranking = rankData || [];
  const loading = !techData || !rankData;

  const fetchData = async () => {
    await Promise.all([mutateTech(), mutateRank()]);
  };

  const handleAddNew = () => {
    setEditingTech(null);
    setShowForm(true);
  };

  const handleEdit = (tech: Technician) => {
    setEditingTech(tech);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTechnician(id);
      fetchData();
    } catch (err) {
      alert('Erro ao excluir técnico');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchData();
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 animate-in-fade">
      <PageHeader
        title="Técnicos"
        subtitle="Equipe técnica operacional e ranking de performance."
        icon={<HardHat className="w-8 h-8" />}
        breadcrumbs={[{ label: 'Técnicos' }]}
        actions={
          !showForm
            ? [
                {
                  label: 'Novo Técnico',
                  icon: <Plus className="w-5 h-5" />,
                  onClick: handleAddNew,
                  className: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg',
                },
              ]
            : []
        }
      />

      {showForm ? (
        <div className="max-w-2xl">
          <TechnicianForm
            companyId={company?.id || ''}
            initialData={editingTech}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <p>Carregando técnicos...</p>
            ) : (
              <TechniciansTable
                technicians={technicians}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
          <div>
            <TechnicianAnalytics ranking={ranking} />
          </div>
        </div>
      )}
    </div>
  );
}
