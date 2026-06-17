'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAppointmentContext } from '@/contexts/appointment-context';

interface ClientSelectorProps {
  clientId: string;
  setClientId: (id: string) => void;
  selectedClientName: string;
  setSelectedClientName: (name: string) => void;
}

export function ClientSelector({
  clientId,
  setClientId,
  selectedClientName,
  setSelectedClientName,
}: ClientSelectorProps) {
  const { clients } = useAppointmentContext();
  const [clientSearch, setClientSearch] = useState('');
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => c.name.toLowerCase().includes(clientSearch.toLowerCase()));
  }, [clients, clientSearch]);

  function selectClient(client: unknown) {
    setClientId(client.id);
    setSelectedClientName(client.name);
    setClientDropdownOpen(false);
  }

  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cliente</label>
      <div className="relative">
        <div
          className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white flex items-center cursor-pointer justify-between"
          onClick={() => {
            setClientDropdownOpen(!clientDropdownOpen);
            setClientSearch('');
          }}
        >
          <span className={selectedClientName ? '' : 'text-zinc-500'}>
            {selectedClientName || 'Selecionar cliente...'}
          </span>
          <Search className="w-4 h-4 text-zinc-500" />
        </div>
        {clientDropdownOpen && (
          <div className="absolute top-11 left-0 right-0 z-10 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-48 overflow-y-auto">
            <div className="p-2 border-b border-zinc-800">
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full h-8 px-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none"
                placeholder="Buscar cliente..."
                autoFocus
              />
            </div>
            <div className="p-1">
              {filteredClients.length === 0 ? (
                <p className="px-2 py-3 text-xs text-zinc-500 text-center">
                  Nenhum cliente encontrado.
                </p>
              ) : (
                filteredClients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectClient(c)}
                    className="w-full text-left px-2 py-2 rounded text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <span className="font-medium">{c.name}</span>
                    {c.phone && <span className="text-zinc-500 ml-2">{c.phone}</span>}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
