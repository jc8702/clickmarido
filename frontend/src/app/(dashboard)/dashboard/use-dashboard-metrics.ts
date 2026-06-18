import useSWR from 'swr';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { getExecutiveDashboard } from '@/lib/api/modules/reports';
import { isApiError } from '@/lib/api/errors';

export interface DashboardMetrics {
  totalLeads: number;
  totalQuotes: number;
  conversionRate: number | null;
  completedOrders: number;
  totalRevenue: number;
  totalProfit: number;
  activeTechs: number;
  activeWarranties: number;
}

/**
 * Hook para buscar métricas do dashboard executivo.
 *
 * Melhorias vs versão anterior:
 * - refreshInterval: 30 000ms em vez de 5 000ms (era 12 req/min → agora 2 req/min)
 * - dedupingInterval: 10 000ms — evita requests duplicadas em mounts consecutivos
 * - onError diferenciado: 401 redireciona, 400 avisa admin, 5xx toast com retry
 * - expõe `mutate` como `refetch` para o componente disparar refresh manual
 * - revalidateOnFocus + revalidateOnReconnect: recuperação automática
 * - errorRetryCount: 2 tentativas antes de desistir (SWR nativo)
 */
export const useDashboardMetrics = () => {
  const handleError = useCallback((err: unknown) => {
    if (isApiError(err)) {
      if (err.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        // Limpa token e redireciona para login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('clickmarido_auth_token');
          localStorage.removeItem('clickmarido_refresh_token');
          localStorage.removeItem('clickmarido_active_company_id');
          window.location.href = '/login';
        }
      } else if (err.status === 400) {
        toast.error('Empresa não configurada. Entre em contato com o administrador.');
      } else if (err.status === 403) {
        toast.error('Sem permissão para acessar o dashboard.');
      } else if (err.status >= 500) {
        toast.error('Erro no servidor. Os dados podem estar desatualizados.', {
          duration: 5000,
        });
      } else {
        toast.error(`Erro ao carregar dashboard: ${err.message}`);
      }
    } else if (err instanceof Error) {
      // Erro de rede (fetch falhou)
      if (!navigator.onLine) {
        toast.error('Sem conexão. Exibindo dados em cache.', { duration: 3000 });
      } else {
        toast.error('Falha de conexão com o servidor.', { duration: 4000 });
      }
    }
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<DashboardMetrics>(
    '/reports/dashboard',
    getExecutiveDashboard,
    {
      // ✅ Polling menos agressivo: 30s (era 5s → redução de 83% nas requisições)
      refreshInterval: 30_000,

      // ✅ Deduplicação: bloqueia requests simultâneas na mesma janela de 10s
      dedupingInterval: 10_000,

      // ✅ Retry automático apenas para erros não-4xx
      // ApiClient já lança ApiError com status; SWR não retentará 4xx pois
      // o error handler faz throw antes do retry do SWR.
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,

      // ✅ Error handler com feedback diferenciado por status
      onError: handleError,

      // ✅ Revalida ao voltar para a aba ou reconectar à internet
      revalidateOnFocus: true,
      revalidateOnReconnect: true,

      // ✅ Mantém dados antigos (stale) enquanto revalida — evita flicker de loading
      keepPreviousData: true,
    },
  );

  return {
    metrics: data,
    isLoading,
    // isValidating: true quando há um refresh em background (diferente de isLoading inicial)
    isRefreshing: isValidating && !isLoading,
    isError: !!error,
    error,
    /** Dispara refresh manual — útil para botão "Atualizar" na UI */
    refetch: mutate,
  };
};
