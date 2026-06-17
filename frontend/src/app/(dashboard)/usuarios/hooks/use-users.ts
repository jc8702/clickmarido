'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api/client';
import type { User, Role } from '../types';

interface UsersResponse {
  success: boolean;
  data: {
    items: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface RolesResponse {
  success: boolean;
  data: Role[];
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rolesRes = await ApiClient.get<RolesResponse>('/users/roles');
      if (rolesRes.success) setRoles(rolesRes.data);

      const activeParam = activeFilter === 'active' ? 'true' : activeFilter === 'inactive' ? 'false' : '';
      const usersRes = await ApiClient.get<UsersResponse>('/users', {
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
    } catch (e: unknown) {
      console.error('Erro ao buscar dados:', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, activeFilter, search, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza de que deseja excluir este usuário? Suas sessões ativas serão encerradas.')) return;
    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/users/${id}`);
      if (res.success) fetchData();
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao excluir usuário.');
    }
  };

  return {
    users, roles, total, page, totalPages, search, roleFilter, activeFilter, loading,
    setSearch, setPage, setRoleFilter, setActiveFilter, fetchData, handleDelete,
  };
}
