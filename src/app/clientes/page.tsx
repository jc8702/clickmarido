'use client';

import { useState } from 'react';
import { Users, Plus, Phone, Mail, MapPin, Trash2, Search } from 'lucide-react';
import { useCrmStore } from '@/modules/crm/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ClientStatus } from '@/types';

const STATUS_LABELS: Record<ClientStatus, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  prospect: 'Prospect',
};

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'destructive' | 'outline'> = {
  ativo: 'success',
  inativo: 'destructive',
  prospect: 'outline',
};

export default function ClientesPage() {
  const { clients, deleteClient } = useCrmStore();
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-500" />
            Clientes
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {clients.length} clientes cadastrados
          </p>
        </div>
        <Button className="flex items-center gap-2 font-semibold">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Buscar por nome, telefone ou e-mail..."
        />
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800">
          <Users className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-zinc-400 font-medium">Nenhum cliente encontrado.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((client) => (
            <Card key={client.id} className="hover:border-zinc-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300 shrink-0">
                      {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{client.name}</h3>
                        <Badge variant={STATUS_VARIANTS[client.status]}>
                          {STATUS_LABELS[client.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </span>
                        {client.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </span>
                        )}
                        {client.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {client.address}
                          </span>
                        )}
                      </div>
                      {client.notes && (
                        <p className="text-xs text-zinc-500 italic">{client.notes}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-400 shrink-0"
                    onClick={() => deleteClient(client.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
