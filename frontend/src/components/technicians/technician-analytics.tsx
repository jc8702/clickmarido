'use client';

import { Technician } from '@/lib/api/modules/technicians';

interface TechnicianAnalyticsProps {
  ranking: Technician[];
}

export function TechnicianAnalytics({ ranking }: TechnicianAnalyticsProps) {
  return (
    <div className="bg-card border shadow-sm rounded-lg p-6 w-full">
      <h3 className="text-lg font-bold mb-4">🏆 Ranking de Produtividade</h3>
      <div className="space-y-4">
        {ranking.length === 0 ? (
          <p className="text-muted-foreground text-sm">Dados insuficientes para gerar o ranking.</p>
        ) : (
          ranking.slice(0, 5).map((tech, index) => (
            <div key={tech.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">⭐ {tech.rating.toFixed(1)} | {tech.specialty || 'Geral'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{tech._count?.serviceOrders || 0}</p>
                <p className="text-xs text-muted-foreground">OS Concluídas</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
