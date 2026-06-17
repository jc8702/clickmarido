'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { User } from '../types';

interface UserCardProps {
  user: User;
  idx: number;
  isCurrentUser: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserCard({ user, idx, isCurrentUser, onEdit, onDelete }: UserCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <Card
      key={user.id}
      className="group glass-card glow-hover border-zinc-900/50 animate-in-slide"
      style={{ animationDelay: `${idx * 0.05}s` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-lg font-black text-zinc-300 group-hover:glow-primary transition-all">
                {initials}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-zinc-950 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
              />
            </div>
            <div className="space-y-3 min-w-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white tracking-tight truncate">
                    {user.name}
                  </h3>
                  <Badge
                    variant={user.isActive ? 'success' : 'destructive'}
                    className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0"
                  >
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 font-medium font-mono">{user.email}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="outline"
                    className="text-[10px] bg-zinc-900 border-zinc-800 text-zinc-400 font-semibold px-2 py-0.5"
                  >
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
              onClick={() => onEdit(user)}
              className="h-10 w-10 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
              aria-label="Editar"
            >
              <Edit className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(user.id)}
              disabled={isCurrentUser}
              className="h-10 w-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              aria-label="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
