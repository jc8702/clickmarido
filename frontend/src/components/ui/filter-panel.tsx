import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  search: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  filters?: FilterField[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (fieldId: string, value: string) => void;
  onClearFilters?: () => void;
  showDateRange?: boolean;
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (range: { from: string; to: string }) => void;
}

export function FilterPanel({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  showDateRange = false,
  dateRange = { from: "", to: "" },
  onDateRangeChange,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={searchPlaceholder}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
        />
      </div>
      
      {(filters.length > 0 || showDateRange) && (
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-zinc-500 hidden md:block mr-1" />
          
          {showDateRange && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-10">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => onDateRangeChange?.({ ...dateRange, from: e.target.value })}
                aria-label="Data inicial"
                className="bg-transparent text-xs text-zinc-300 focus:outline-none"
              />
              <span className="text-zinc-500 text-xs" aria-hidden="true">até</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => onDateRangeChange?.({ ...dateRange, to: e.target.value })}
                aria-label="Data final"
                className="bg-transparent text-xs text-zinc-300 focus:outline-none"
              />
            </div>
          )}
          
          {filters.map(filter => (
            <select
              key={filter.id}
              value={activeFilters[filter.id] || ""}
              onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
              aria-label={filter.label}
              className="h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
            >
              <option value="">{filter.label}</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
          
          {(Object.values(activeFilters).some(v => v !== "") || dateRange.from || dateRange.to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-zinc-400 hover:text-white h-10"
            >
              <X className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
