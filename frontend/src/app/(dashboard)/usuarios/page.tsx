'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, Trash2, Search, ArrowLeft, Edit, XCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  roles: Role[];
}

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();

  // Estados de dados
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de busca e filtros
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Estados de formulário/modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleIds: [] as string[],
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Carrega os dados da API
  const fetchData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // 1. Busca os papéis (roles) disponíveis no tenant
      const rolesRes = await ApiClient.get<{ success: boolean; data: Role[] }>('/users/roles');
      if (rolesRes.success) {
        setRoles(rolesRes.data);
      }

      // 2. Busca a lista de usuários paginada/filtrada
      const activeParam = activeFilter === 'active' ? 'true' : activeFilter === 'inactive' ? 'false' : '';
      const usersRes = await ApiClient.get<{
        success: boolean;
        data: {
          items: User[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/users', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          roleId: roleFilter,
          active: activeParam,
        },
      });

      if (usersRes.success) {
        setUsers(usersRes.data.items);
        setTotal(usersRes.data.total);
        setTotalPages(usersRes.data.totalPages);
      }
    } catch (e: any) {
      console.error('Erro ao buscar dados:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, roleFilter, activeFilter, currentUser]);

  // Handler de Busca com debouncing leve
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Apenas Administradores e Gestores gerenciam usuários/time
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

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      roleIds: [],
      isActive: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (targetUser: User) => {
    setSelectedUser(targetUser);
    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      password: '', // Senha vazia por padrão ao editar
      roleIds: targetUser.roles.map((r) => r.id),
      isActive: targetUser.isActive,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => {
      const isSelected = prev.roleIds.includes(roleId);
      const newRoleIds = isSelected 
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId];
      return { ...prev, roleIds: newRoleIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (formData.roleIds.length === 0) {
      setFormError('Selecione pelo menos um perfil para o usuário.');
      setFormLoading(false);
      return;
    }

    try {
      if (selectedUser) {
        // Editar
        // Se a senha estiver em branco na edição, não a enviamos para a API
        const payload: any = { ...formData };
        if (!payload.password) {
          delete payload.password;
        }
        const res = await ApiClient.put<{ success: boolean }>(`/users/${selectedUser.id}`, payload);
        if (res.success) {
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        // Criar
        if (!formData.password) {
          setFormError('A senha é obrigatória para novos usuários.');
          setFormLoading(false);
          return;
        }
        const res = await ApiClient.post<{ success: boolean }>('/users', formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar usuário.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert('Você não pode excluir o seu próprio usuário.');
      return;
    }
    if (!confirm('Tem certeza de que deseja excluir este usuário? Suas sessões ativas serão encerradas.')) return;

    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/users/${id}`);
      if (res.success) {
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário.');
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      {/* Header Section */}
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
          <Button 
            onClick={handleOpenCreateModal}
            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 font-bold shrink-0 ml-auto md:ml-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="grid gap-4 md:grid-cols-4 items-center bg-zinc-950/20 p-4 rounded-2xl border border-zinc-900/60 backdrop-blur-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            placeholder="Nome ou e-mail..."
          />
        </div>
        
        <div>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer"
          >
            <option value="">Todos os Perfis</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Colaboradores */}
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
          <p className="text-zinc-500 mt-2 max-w-sm">
            Tente ajustar os termos da busca ou adicione um novo usuário.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {users.map((targetUser, idx) => (
              <Card key={targetUser.id} className="group glass-card glow-hover border-zinc-900/50 animate-in-slide" style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-lg font-black text-zinc-300 group-hover:glow-primary transition-all">
                          {targetUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-zinc-950 rounded-full ${targetUser.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <div className="space-y-3 min-w-0">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-white tracking-tight truncate">{targetUser.name}</h3>
                            <Badge variant={targetUser.isActive ? 'success' : 'destructive'} className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0">
                              {targetUser.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium font-mono">{targetUser.email}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {targetUser.roles.map((role) => (
                            <Badge key={role.id} variant="outline" className="text-[10px] bg-zinc-900 border-zinc-800 text-zinc-400 font-semibold px-2 py-0.5">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                        onClick={() => handleOpenEditModal(targetUser)}
                        aria-label="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        onClick={() => handleDelete(targetUser.id)}
                        disabled={targetUser.id === currentUser?.id}
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
              <span className="text-sm font-medium text-zinc-500">
                Página <span className="text-white">{page}</span> de <span className="text-white">{totalPages}</span>
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

      {/* Modal CRUD de Usuários */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                {selectedUser ? 'Edite as informações e perfis do colaborador.' : 'Cadastre um novo membro no time.'}
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {selectedUser ? 'Senha (deixe em branco para manter)' : 'Senha de Acesso'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    required={!selectedUser}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                    placeholder={selectedUser ? '••••••••' : 'No mínimo 6 caracteres'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Perfil de Acesso</label>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                    {roles.map((role) => {
                      const isSelected = formData.roleIds.includes(role.id);
                      return (
                        <div 
                          key={role.id}
                          onClick={() => handleRoleToggle(role.id)}
                          className={`flex items-center gap-2 p-2 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 font-bold' 
                              : 'bg-zinc-900/50 border-zinc-850 hover:bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="hidden"
                          />
                          <span>{role.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="userActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded bg-zinc-900 border-zinc-800 text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <label htmlFor="userActive" className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer">
                  Usuário Ativo e Habilitado
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Usuário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
