export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatMinutes(value: number): string {
  return `${value} min`;
}

const complexityStyles: Record<string, string> = {
  Alta: 'text-red-400',
  Média: 'text-amber-400',
  Baixa: 'text-emerald-400',
};

export function getComplexityClass(complexity: string): string {
  return complexityStyles[complexity] || 'text-zinc-400';
}
