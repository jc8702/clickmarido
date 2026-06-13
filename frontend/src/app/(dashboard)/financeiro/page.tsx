'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FinancialSummary, FinancialDre, FinancialProjection, getFinancialSummary, getFinancialDre, getFinancialProjection } from '@/lib/api-financial';
import { DollarSign, TrendingUp, TrendingDown, Clock, Activity, FileText, CalendarDays } from 'lucide-react';

const COMPANY_ID = "6fb48ab0-08ab-49bd-9eab-57dd4f923ff1"; // MOCK for MVP

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function FinanceiroDashboardPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [dre, setDre] = useState<FinancialDre | null>(null);
  const [projection, setProjection] = useState<FinancialProjection[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      getFinancialSummary(COMPANY_ID),
      getFinancialDre(COMPANY_ID, currentMonth, currentYear),
      getFinancialProjection(COMPANY_ID, 30)
    ])
      .then(([summaryData, dreData, projectionData]) => {
        setSummary(summaryData);
        setDre(dreData);
        setProjection(projectionData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8">Carregando métricas financeiras...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <DollarSign className="w-7 h-7" />
          </div>
          Painel Financeiro
        </h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              DRE Gerencial - {dre?.period}
            </h3>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between font-bold text-emerald-600">
              <span>Receita Bruta Total</span>
              <span>{formatCurrency(dre?.grossRevenue || 0)}</span>
            </div>
            
            <div className="pl-4 space-y-1 text-muted-foreground border-l-2 border-emerald-100">
              {dre?.revenuesByCategory && Object.entries(dre.revenuesByCategory).map(([cat, val]) => (
                <div key={cat} className="flex justify-between">
                  <span>{cat}</span>
                  <span>{formatCurrency(val as number)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-rose-600 border-t pt-4">
              <span>Despesas Totais</span>
              <span>{formatCurrency(dre?.totalExpenses || 0)}</span>
            </div>

            <div className="pl-4 space-y-1 text-muted-foreground border-l-2 border-rose-100">
              {dre?.expensesByCategory && Object.entries(dre.expensesByCategory).map(([cat, val]) => (
                <div key={cat} className="flex justify-between">
                  <span>{cat}</span>
                  <span>{formatCurrency(val as number)}</span>
                </div>
              ))}
            </div>

            <div className={`flex justify-between font-black text-lg border-t pt-4 ${(dre?.netIncome || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span>Lucro Líquido / Prejuízo</span>
              <span>{formatCurrency(dre?.netIncome || 0)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Projeção de Fluxo de Caixa (30 dias)
            </h3>
          </div>

          {projection.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Nenhuma transação futura provisionada para os próximos 30 dias.
            </div>
          ) : (
            <div className="space-y-3">
              {projection.map((item) => {
                // Formata a data: YYYY-MM-DD para DD/MM
                const dateObj = new Date(item.date + 'T00:00:00');
                const label = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
                
                return (
                  <div key={item.date} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                    <span className="font-medium w-16">{label}</span>
                    <div className="flex gap-4 w-full justify-end">
                      <span className="text-emerald-500 min-w-20 text-right">
                        {item.toReceive > 0 ? `+${formatCurrency(item.toReceive)}` : '-'}
                      </span>
                      <span className="text-rose-500 min-w-20 text-right">
                        {item.toPay > 0 ? `-${formatCurrency(item.toPay)}` : '-'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
