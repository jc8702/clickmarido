'use client';

import { useState } from 'react';
import { Wrench, Plus, Search, ArrowLeft, Download, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useServices } from './hooks/use-services';
import { ServiceCard } from './components/service-card';
import type { Service } from './types';

const ServiceFormModal = dynamic(
  () => import('./components/service-form-modal').then((m) => m.ServiceFormModal),
  { ssr: false },
);
const ServiceImportModal = dynamic(
  () => import('./components/service-import-modal').then((m) => m.ServiceImportModal),
  { ssr: false },
);

function ServicosPageInner() {
  const {
    services,
    total,
    page,
    totalPages,
    search,
    categoryFilter,
    statusFilter,
    loading,
    setPage,
    setSearch,
    setCategoryFilter,
    setStatusFilter,
    handleDelete,
    fetchServices,
  } = useServices();

  const [formModal, setFormModal] = useState({ open: false, service: null as Service | null });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportCsv = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('clickmarido_auth_token');
      const companyId =
        localStorage.getItem('clickmarido_active_company_id') ||
        localStorage.getItem('clickmarido_active_tenant_id');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/services/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-company-id': companyId || '',
            'x-tenant-id': companyId || '',
          },
        },
      );

      if (!res.ok) throw new Error('Falha ao baixar o arquivo CSV.');

      const csvContent = await res.text();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'catalogo-servicos.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao exportar catálogo.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Link
              href="/dashboard"
              className="hover:text-violet-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-violet-500/10 text-violet-500">
              <Wrench className="w-8 h-8" />
            </div>
            Catálogo de Serviços
          </h1>
          <p className="text-zinc-400 font-medium">
            Gerenciando <span className="text-white font-bold">{total}</span> serviços cadastrados
            no catálogo
          </p>
        </div>

        <div className="flex flex-wrap w-full md:w-auto gap-3">
          <Button
            onClick={handleExportCsv}
            disabled={exportLoading}
            variant="outline"
            className="h-11 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-850 hover:text-white text-zinc-300 font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
          <Button
            onClick={() => setImportModalOpen(true)}
            variant="outline"
            className="h-11 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-850 hover:text-white text-zinc-300 font-bold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Importar CSV
          </Button>
          <Button
            onClick={() => setFormModal({ open: true, service: null })}
            className="h-11 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/20 font-bold shrink-0 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Novo Serviço
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 items-center bg-zinc-950/20 p-4 rounded-2xl border border-zinc-900/60 backdrop-blur-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all placeholder:text-zinc-650"
            placeholder="Buscar serviço pelo nome..."
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all cursor-pointer"
        >
          <option value="">Todas as Categorias</option>
          <option value="Elétrica">Elétrica</option>
          <option value="Hidráulica">Hidráulica</option>
          <option value="Instalações">Instalações</option>
          <option value="Marcenaria">Marcenaria</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all cursor-pointer"
        >
          <option value="">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
          <span className="text-zinc-500 mt-4 font-semibold">Carregando catálogo...</span>
        </div>
      ) : services.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed border-zinc-800 glass-card">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <Wrench className="w-10 h-10 text-zinc-700 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300">Nenhum serviço encontrado</h3>
          <p className="text-zinc-500 mt-2 max-w-sm">
            Tente ajustar os filtros ou cadastre um novo serviço no catálogo.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {services.map((service, idx) => (
              <ServiceCard
                key={service.id}
                service={service}
                idx={idx}
                onEdit={(s) => setFormModal({ open: true, service: s })}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
              <span className="text-sm font-medium text-zinc-500">
                Página <span className="text-white">{page}</span> de{' '}
                <span className="text-white">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold h-9 px-4 rounded-lg text-xs"
                >
                  Anterior
                </Button>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold h-9 px-4 rounded-lg text-xs"
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ServiceFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, service: null })}
        onSuccess={fetchServices}
        service={formModal.service}
      />
      <ServiceImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={fetchServices}
      />
    </div>
  );
}

export default function ServicosPage() {
  return (
    <ErrorBoundary>
      <ServicosPageInner />
    </ErrorBoundary>
  );
}
