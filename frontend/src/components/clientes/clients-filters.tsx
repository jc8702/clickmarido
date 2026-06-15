'use client';

import { useClientContext } from '@/contexts/client-context';
import { FilterPanel } from '@/components/ui/filter-panel';

export function ClientsFilters() {
  const { data } = useClientContext();
  const { search, setSearch } = data;

  return (
    <div className="grid gap-4 md:grid-cols-4 items-center bg-zinc-950/20 p-4 rounded-2xl border border-zinc-900/60 backdrop-blur-sm">
      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nome, email ou telefone..."
      />
    </div>
  );
}
