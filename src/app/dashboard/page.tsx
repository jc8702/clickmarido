'use client';

import Link from 'next/link';
import {
  Users,
  Wrench,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useCrmStore } from '@/modules/crm/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

const STATUS_LABELS: Record<string, string> = {
  agendado: 'Agendado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const STATUS_VARIANTS: Record<string, 'default' | 'success' | 'destructive' | 'outline'> = {
  agendado: 'outline',
  em_andamento: 'default',
  concluido: 'success',
  cancelado: 'destructive',
};

export default function DashboardPage() {
  const { clients, services, getDashboardStats } = useCrmStore();
  const stats = getDashboardStats();

  const recentServices = services.slice(0, 5);
  const recentClients = clients.slice(0, 4);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Painel de Controle
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Gerencie clientes, serviços e orçamentos da Click Marido.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/clientes/novo">
            <Button className="flex items-center gap-2 font-semibold">
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>
          </Link>
          <Link href="/servicos/novo">
            <Button variant="outline" className="flex items-center gap-2 font-semibold">
              <Wrench className="w-4 h-4" />
              Novo Serviço
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-zinc-500 mt-1">
              {stats.activeClients} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Serviços Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats.pendingServices}</div>
            <p className="text-xs text-zinc-500 mt-1">Agendados e em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Concluídos no Mês</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{stats.completedThisMonth}</div>
            <p className="text-xs text-zinc-500 mt-1">Serviços finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Receita do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {formatCurrency(stats.revenueThisMonth)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Baseado em serviços concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Orçamentos Pendentes</CardTitle>
            <Wrench className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stats.pendingQuotes}</div>
            <p className="text-xs text-zinc-500 mt-1">Aguardando resposta do cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Serviços Recentes + Clientes Recentes */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Serviços Recentes */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-500" />
              Atendimentos Recentes
            </h2>
          </div>

          {recentServices.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800">
              <Wrench className="w-12 h-12 text-zinc-600 mb-4" />
              <CardTitle className="text-lg font-medium text-zinc-300">Nenhum serviço ainda</CardTitle>
              <CardDescription className="mt-1 text-sm text-zinc-500">
                Registre seu primeiro atendimento.
              </CardDescription>
              <Link href="/servicos/novo" className="mt-6">
                <Button variant="outline" size="sm">
                  Registrar Serviço
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentServices.map((service) => {
                const client = clients.find((c) => c.id === service.clientId);
                return (
                  <Card key={service.id} className="hover:border-zinc-700 transition-colors">
                    <div className="flex items-center justify-between p-5">
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{service.description}</h3>
                          <Badge variant={STATUS_VARIANTS[service.status]}>
                            {STATUS_LABELS[service.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {client?.name ?? 'Cliente não encontrado'}
                          </span>
                          {service.scheduledAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(service.scheduledAt)}
                            </span>
                          )}
                          {service.valueFinal && (
                            <span className="text-emerald-400 font-semibold">
                              {formatCurrency(service.valueFinal)}
                            </span>
                          )}
                          {!service.valueFinal && service.valueEstimate && (
                            <span className="text-zinc-400">
                              Est: {formatCurrency(service.valueEstimate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="w-4 h-4 text-zinc-400" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Clientes Recentes */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Clientes Recentes
          </h2>

          <div className="space-y-3">
            {recentClients.length === 0 ? (
              <Card className="p-6 text-center border-dashed border-zinc-800">
                <p className="text-sm text-zinc-500">Nenhum cliente cadastrado.</p>
              </Card>
            ) : (
              recentClients.map((client) => (
                <Card key={client.id} className="bg-zinc-900/40 hover:bg-zinc-900/80 transition-all border-zinc-900">
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0">
                      {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-semibold text-white truncate">{client.name}</p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </p>
                    </div>
                    <Badge
                      variant={client.status === 'ativo' ? 'success' : client.status === 'prospect' ? 'outline' : 'destructive'}
                      className="text-[10px] shrink-0"
                    >
                      {client.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}

            <Link href="/clientes">
              <Button variant="ghost" size="sm" className="w-full text-zinc-400 hover:text-white">
                Ver todos os clientes
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
