import { toast } from 'sonner';
import { useErrorStore, ApiError } from '@/store/use-error-store';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export interface FetchOptions extends RequestInit {
  retries?: number;
}

const parseErrorResponse = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    if (data && data.error) {
      return data.error as ApiError;
    }
  } catch (e) {
    // Falha ao parsear JSON
  }
  
  return {
    code: `HTTP_${response.status}`,
    message: response.statusText || 'Erro inesperado no servidor',
    timestamp: new Date().toISOString(),
    path: response.url,
    requestId: 'unknown',
  };
};

export const apiFetch = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const { retries = MAX_RETRIES, ...fetchOptions } = options;
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await fetch(url, fetchOptions);

      if (response.ok) {
        return response;
      }

      // Handle Error Responses (4xx, 5xx)
      const errorData = await parseErrorResponse(response);
      useErrorStore.getState().setLastError(errorData);

      if (response.status >= 400 && response.status < 500) {
        // Erros do cliente (ex: 400, 401, 403, 404, 409) não devem fazer retry
        toast.error(`Erro: ${errorData.message}`);
        throw new Error(errorData.message);
      }

      // Se for 5xx, prepara para retry
      if (attempt === retries - 1) {
        toast.error('O servidor não está respondendo. Tente novamente mais tarde.', {
          action: {
            label: 'Tentar Novamente',
            onClick: () => apiFetch(url, options),
          },
        });
        throw new Error(errorData.message);
      }
    } catch (error: any) {
      // Erro de rede (offline)
      if (!window.navigator.onLine) {
        useErrorStore.getState().addOfflineError({
          code: 'OFFLINE',
          message: 'Sem conexão com a internet',
          timestamp: new Date().toISOString(),
          path: url,
          requestId: 'unknown'
        });
        toast.error('Você está offline. Verifique sua conexão.');
        throw error;
      }

      if (attempt === retries - 1) {
        throw error;
      }
    }

    // Exponential Backoff
    attempt++;
    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error('Falha após múltiplas tentativas');
};
