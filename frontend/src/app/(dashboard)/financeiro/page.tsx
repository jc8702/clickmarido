'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FinancialSummary, getFinancialSummary } from '@/lib/api-financial';
import { DollarSign, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

const COMPANY_ID = "6fb48ab0-08ab-49bd-9eab-57dd4f923ff1"; // MOCK for MVP

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function FinanceiroDashboardPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinancialSummary(COMPANY_ID)
      .then(data => setSummary(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8">Carregando métricas financeiras...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Painel Financeiro</h2>
        <Link href="/financeiro/transacoes" className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium text-sm">
          Acessar Extrato Detalhado
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card Saldo de Caixa */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="tracking-tight text-sm font-medium">Saldo de Caixa Atual</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-black text-blue-500">
            {formatCurrency(summary?.currentBalance || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Baseado em transações PAGAS.</p>
        </div>

        {/* Card Receitas Recebidas */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="tracking-tight text-sm font-medium">Receitas Confirmadas</h3>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">
            {formatCurrency(summary?.totalIncomes || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Entradas efetivadas.</p>
        </div>

        {/* Card Despesas Pagas */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="tracking-tight text-sm font-medium">Despesas Pagas</h3>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-500">
            {formatCurrency(summary?.totalExpenses || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Saídas efetivadas.</p>
        </div>

        {/* Card Pendências */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="tracking-tight text-sm font-medium">Fluxo Pendente</h3>
            <Activity className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="flex flex-col text-sm font-medium">
            <span className="text-emerald-500">A receber: {formatCurrency(summary?.pendingToReceive || 0)}</span>
            <span className="text-rose-500">A pagar: {formatCurrency(summary?.pendingToPay || 0)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Provisão de caixa futuro.</p>
        </div>
      </div>
    </div>
  );
}
