'use client';

import { FileText, Plus } from 'lucide-react';
import { useCrmStore } from '@/modules/crm/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrcamentosPage() {
  const { quotes } = useCrmStore();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-purple-500" />
            Orçamentos
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Gerencie propostas e orçamentos enviados aos clientes.
          </p>
        </div>
        <Button className="flex items-center gap-2 font-semibold">
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </Button>
      </div>

      {quotes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-zinc-800">
          <FileText className="w-14 h-14 text-zinc-600 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-300">Nenhum orçamento ainda</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            Crie seu primeiro orçamento para enviar ao cliente via WhatsApp.
          </p>
          <Button className="mt-6" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Criar Orçamento
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <Card key={q.id} className="p-4">
              <p className="text-white font-semibold">{q.id}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
