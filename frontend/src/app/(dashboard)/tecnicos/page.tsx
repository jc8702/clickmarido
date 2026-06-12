'use client';

import { useState, useEffect } from 'react';
import { Technician, getTechnicians, getTechnicianRanking, deleteTechnician } from '@/lib/api-technicians';
import { TechniciansTable } from '@/components/technicians/technicians-table';
import { TechnicianForm } from '@/components/technicians/technician-form';
import { TechnicianAnalytics } from '@/components/technicians/technician-analytics';

// Mock COMPANY ID by now since context is not globally provided in this snippet
const COMPANY_ID = "6fb48ab0-08ab-49bd-9eab-57dd4f923ff1";

export default function TecnicosPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [ranking, setRanking] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [techData, rankData] = await Promise.all([
        getTechnicians(COMPANY_ID),
        getTechnicianRanking(COMPANY_ID)
      ]);
      setTechnicians(techData);
      setRanking(rankData);
    } catch (err) {
      console.error('Falha ao carregar técnicos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Técnicos</h2>
        {!showForm && (
          <button 
            onClick={handleAddNew}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium shadow"
          >
            + Novo Técnico
          </button>
        )}
      </div>

      {showForm ? (
        <div className="max-w-2xl">
          <TechnicianForm 
            companyId={COMPANY_ID} 
            initialData={editingTech} 
            onSuccess={handleFormSuccess} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? <p>Carregando técnicos...</p> : (
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
