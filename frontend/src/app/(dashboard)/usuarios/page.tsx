'use client';

import { useState } from 'react';
import { Users, Plus, Search, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/auth-context';

import { useUsers } from './hooks/use-users';
import { UserCard } from './components/user-card';
import type { User } from './types';

const UserFormModal = dynamic(() => import('./components/user-form-modal').then(m => m.UserFormModal), { ssr: false });

function UsuariosPageInner() {
  const { user: currentUser } = useAuth();
  const {
    users, roles, total, page, totalPages, search, roleFilter, activeFilter, loading,
    setSearch, setPage, setRoleFilter, setActiveFilter, fetchData, handleDelete,
  } = useUsers();

  const [formModal, setFormModal] = useState({ open: false, user: null as User | null });

  const canAccess = currentUser?.roles.includes('Administrador') || currentUser?.roles.includes('Gestor');

  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center min-h-[70vh]">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">Acesso restrito</h3>
        <p className="text-zinc-400 mt-2 max-w-sm font-medium">
          Apenas administradores e gestores da empresa têm permissão para visualizar e gerenciar o time.
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-11 px-6 rounded-xl">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500">
              <Users className="w-8 h-8" />
            </div>
            Usuários
          </h1>
          <p className="text-zinc-400 font-medium">
            Gerenciando o time operacional com <span className="text-white font-bold">{total}</span> colaboradores
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <Button onClick={() => setFormModal({ open: true, user: null })}
            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 font-bold shrink-0 ml-auto md:ml-0">
            <Plus className="w-5 h-5 mr-2" /> Novo Usuário
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 items-center bg-zinc-950/20 p-4 rounded-2xl border border-zinc-900/60 backdrop-blur-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            placeholder="Nome ou e-mail..." />
        </div>
        <select value={activeFilter} onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
          className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer">
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer">
          <option value="">Todos os Perfis</option>
          {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="text-zinc-500 mt-4 font-semibold">Carregando usuários...</span>
        </div>
      ) : users.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed border-zinc-800 glass-card">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-zinc-700 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300">Nenhum colaborador cadastrado</h3>
          <p className="text-zinc-500 mt-2 max-w-sm">Tente ajustar os termos da busca ou adicione um novo usuário.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {users.map((targetUser, idx) => (
              <UserCard key={targetUser.id} user={targetUser} idx={idx}
                isCurrentUser={targetUser.id === currentUser?.id}
                onEdit={(u) => setFormModal({ open: true, user: u })}
                onDelete={(id) => {
                  if (id === currentUser?.id) {
                    alert('Você não pode excluir o seu próprio usuário.');
                    return;
                  }
                  handleDelete(id);
                }} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
              <span className="text-sm font-medium text-zinc-500">
                Página <span className="text-white">{page}</span> de <span className="text-white">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold h-9 px-4 rounded-lg text-xs">Anterior</Button>
                <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold h-9 px-4 rounded-lg text-xs">Próxima</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <UserFormModal isOpen={formModal.open} onClose={() => setFormModal({ open: false, user: null })} onSuccess={fetchData} user={formModal.user} roles={roles} />
    </div>
  );
}

export default function UsuariosPage() {
  return (
    <ErrorBoundary>
      <UsuariosPageInner />
    </ErrorBoundary>
  );
}
