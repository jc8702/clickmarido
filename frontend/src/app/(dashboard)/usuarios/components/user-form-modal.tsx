import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import { User, Role } from '../types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
  roles: Role[];
}

export function UserFormModal({ isOpen, onClose, onSuccess, user, roles }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleIds: [] as string[],
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '', // Senha vazia por padrão ao editar
          roleIds: user.roles.map((r) => r.id),
          isActive: user.isActive,
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          roleIds: [],
          isActive: true,
        });
      }
      setFormError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

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
      if (user) {
        const payload: Record<string, unknown> = { ...formData };
        if (!payload.password) {
          delete payload.password;
        }
        const res = await ApiClient.put<{ success: boolean }>(`/users/${user.id}`, payload);
        if (res.success) {
          onSuccess();
          onClose();
        }
      } else {
        if (!formData.password) {
          setFormError('A senha é obrigatória para novos usuários.');
          setFormLoading(false);
          return;
        }
        const res = await ApiClient.post<{ success: boolean }>('/users', formData);
        if (res.success) {
          onSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Erro ao salvar usuário.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            {user
              ? 'Edite as informações e perfis do colaborador.'
              : 'Cadastre um novo membro no time.'}
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Nome Completo
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                E-mail
              </label>
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
                {user ? 'Senha (deixe em branco para manter)' : 'Senha de Acesso'}
              </label>
              <input
                type="password"
                name="password"
                required={!user}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                placeholder={user ? '••••••••' : 'No mínimo 6 caracteres'}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Perfil de Acesso
              </label>
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
                      <input type="checkbox" checked={isSelected} readOnly className="hidden" />
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
            <label
              htmlFor="userActive"
              className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer"
            >
              Usuário Ativo e Habilitado
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
            <Button
              type="button"
              onClick={onClose}
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
  );
}
