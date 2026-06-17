'use client';

import { Wrench, Clock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Service } from '../types';
import { formatCurrency, getComplexityClass } from '../utils';

interface ServiceCardProps {
  service: Service;
  idx: number;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceCard({ service, idx, onEdit, onDelete }: ServiceCardProps) {
  return (
    <Card
      key={service.id}
      className="group glass-card glow-hover border-zinc-900/50 animate-in-slide"
      style={{ animationDelay: `${idx * 0.05}s` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-lg font-black text-zinc-300 group-hover:glow-primary transition-all">
                <Wrench className="w-6 h-6 text-zinc-500 group-hover:text-violet-500 transition-colors" />
              </div>
            </div>
            <div className="space-y-3 min-w-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white tracking-tight truncate">
                    {service.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-violet-500/10 border-violet-500/20 text-violet-400 font-semibold px-2"
                  >
                    {service.category}
                  </Badge>
                  {!service.active && (
                    <Badge
                      variant="destructive"
                      className="text-[10px] font-black uppercase px-2 py-0.5"
                    >
                      Inativo
                    </Badge>
                  )}
                </div>
                {service.specialty && (
                  <p className="text-xs text-zinc-500 font-medium">
                    Especialidade: <span className="text-zinc-400">{service.specialty}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <span>{formatCurrency(service.value)}</span>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{service.averageTime} min</span>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1">
                  <span className="text-[10px] opacity-70 uppercase mr-0.5 text-zinc-500 font-bold">
                    Complexidade:
                  </span>
                  <span className={getComplexityClass(service.complexity)}>
                    {service.complexity}
                  </span>
                </div>

                {service.warranty > 0 && (
                  <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1">
                    <span className="text-[10px] opacity-70 uppercase mr-0.5 text-zinc-500 font-bold">
                      Garantia:
                    </span>
                    <span>{service.warranty} dias</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-zinc-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all"
              onClick={() => onEdit(service)}
              aria-label="Editar"
            >
              <Edit className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              onClick={() => onDelete(service.id)}
              aria-label="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {service.description && (
          <div className="mt-5 p-3 rounded-lg bg-zinc-950/50 border border-zinc-900 text-xs text-zinc-500 italic leading-relaxed">
            &quot;{service.description}&quot;
          </div>
        )}
      </CardContent>
    </Card>
  );
}
