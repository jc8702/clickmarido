'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, HeartHandshake, CheckCircle2, Circle, Clock } from 'lucide-react';
import { FollowUp, getFollowUps, syncFollowUps, triggerCronManually } from '@/lib/api/modules/follow-ups';
import { format, differenceInDays } from 'date-fns';

export default function PosVendaPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getFollowUps();
      setFollowUps(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncFollowUps();
      await fetchData();
    } catch(e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleTrigger = async () => {
    if(confirm('Isso vai rodar a rotina agora e enviar WhatsApps pendentes. Tem certeza?')) {
      try {
        await triggerCronManually();
        alert('Processamento iniciado em background!');
        setTimeout(fetchData, 3000);
      } catch(e) {
        console.error(e);
      }
    }
  };

  const renderStatusStep = (sent: boolean, daysRequired: number, completionDateStr: string | undefined) => {
    if (sent) return <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />;
    
    if (!completionDateStr) return <Circle className="w-5 h-5 text-muted-foreground/30 mx-auto" />;
    
    const daysDiff = differenceInDays(new Date(), new Date(completionDateStr));
    if (daysDiff >= daysRequired) {
      return <Clock className="w-5 h-5 text-amber-500 mx-auto" />;
    }
    
    return <Circle className="w-5 h-5 text-muted-foreground/30 mx-auto" />;
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-500">
              <HeartHandshake className="w-7 h-7" />
            </div>
            Pós-Venda
          </h2>
          <p className="text-muted-foreground">Régua automatizada de relacionamento via WhatsApp.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleTrigger} className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 font-medium text-sm">
            Disparar Régua Agora
          </button>
          <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 font-medium text-sm disabled:opacity-50">
            <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Sincronizar OS
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="glass-card border-border/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-1">1 Dia</h3>
          <p className="font-bold">Avaliação do Serviço</p>
        </div>
        <div className="glass-card border-border/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-1">7 Dias</h3>
          <p className="font-bold">Pesquisa de Satisfação</p>
        </div>
        <div className="glass-card border-border/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-1">30 Dias</h3>
          <p className="font-bold">Incentivo de Indicação</p>
        </div>
        <div className="glass-card border-border/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-1">90 Dias</h3>
          <p className="font-bold">Oferta Nova Manutenção</p>
        </div>
      </div>

      <div className="glass-card border-border/50 rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">Cliente</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">OS e Conclusão</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs text-center">Avaliação (1d)</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs text-center">Pesquisa (7d)</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs text-center">Indicação (30d)</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs text-center">Retorno (90d)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Carregando régua...</td></tr>
            ) : followUps.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Nenhuma Ordem de Serviço em pós-venda.</td></tr>
            ) : (
              followUps.map((f) => {
                const completionDate = f.serviceOrder?.updatedAt;
                return (
                  <tr key={f.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-emerald-500" /> {f.client?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{f.client?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">OS #{f.serviceOrder?.number}</div>
                      <div className="text-xs text-muted-foreground">{completionDate ? format(new Date(completionDate), 'dd/MM/yyyy') : '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusStep(f.sent1Day, 1, completionDate)}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusStep(f.sent7Days, 7, completionDate)}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusStep(f.sent30Days, 30, completionDate)}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusStep(f.sent90Days, 90, completionDate)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
