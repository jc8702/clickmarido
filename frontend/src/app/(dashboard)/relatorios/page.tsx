'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { getCommercialReport, getOperationalReport, getFinancialReport, CommercialReport, OperationalReport, FinancialReport } from '@/lib/api-reports';
import { BarChart3, TrendingUp, Users, DollarSign, Wallet, Percent, FileText } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<'commercial' | 'operational' | 'financial'>('commercial');
  const [commercial, setCommercial] = useState<CommercialReport | null>(null);
  const [operational, setOperational] = useState<OperationalReport | null>(null);
  const [financial, setFinancial] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [c, o, f] = await Promise.all([
          getCommercialReport(),
          getOperationalReport(),
          getFinancialReport()
        ]);
        setCommercial(c);
        setOperational(o);
        setFinancial(f);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Carregando métricas e montando gráficos...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios e Dashboards</h2>
          <p className="text-muted-foreground">Visão consolidada da operação, comercial e financeiro.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-md max-w-md">
        <button 
          onClick={() => setActiveTab('commercial')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${activeTab === 'commercial' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
        >
          <TrendingUp className="w-4 h-4" /> Comercial
        </button>
        <button 
          onClick={() => setActiveTab('operational')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${activeTab === 'operational' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
        >
          <Users className="w-4 h-4" /> Operacional
        </button>
        <button 
          onClick={() => setActiveTab('financial')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-sm transition-all ${activeTab === 'financial' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
        >
          <DollarSign className="w-4 h-4" /> Financeiro
        </button>
      </div>

      {/* Tab Content: Comercial */}
      {activeTab === 'commercial' && commercial && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Conversão (Orçamentos)</h3>
                <Percent className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold">{commercial.conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{commercial.approvedQuotes} de {commercial.totalQuotes} orçamentos viraram OS</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Ticket Médio</h3>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold">R$ {commercial.ticketMedio.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Baseado em {commercial.completedOrders} ordens concluídas</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Serviços Vendidos</h3>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold">{commercial.topServices.reduce((a, b) => a + b.value, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de itens faturados (Top 5)</p>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-6">Top 5 Serviços Mais Vendidos</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commercial.topServices}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Operacional */}
      {activeTab === 'operational' && operational && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Tempo Médio de Conclusão</h3>
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{operational.avgTimeDays} dias</div>
              <p className="text-xs text-muted-foreground mt-1">Média entre a criação e conclusão da OS</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-6">Produtividade por Técnico (OS Concluídas)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={operational.productivity}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="concluídas"
                    >
                      {operational.productivity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Financeiro */}
      {activeTab === 'financial' && financial && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Receita Bruta</h3>
              </div>
              <div className="text-3xl font-bold text-emerald-500">R$ {financial.totalIncome.toFixed(2)}</div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Despesas</h3>
              </div>
              <div className="text-3xl font-bold text-red-500">R$ {financial.totalExpense.toFixed(2)}</div>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Lucro Líquido</h3>
              </div>
              <div className={`text-3xl font-bold ${financial.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                R$ {financial.netProfit.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-6">DRE Mensal - Receitas vs Despesas</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financial.chartData}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="receita" name="Receitas" stroke="#10b981" fillOpacity={1} fill="url(#colorReceita)" />
                  <Area type="monotone" dataKey="despesa" name="Despesas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
