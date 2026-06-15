# Guia de Error Handling do ClickMarido

Este guia descreve como lidamos com erros em toda a stack, garantindo consistência, logs estruturados e ótima experiência do usuário.

## 1. Backend

### 1.1 Custom Exceptions
Sempre que precisar interromper o fluxo com um erro para o cliente, utilize as exceções customizadas em `src/common/exceptions`:

```typescript
// Exemplo: Erro de negócio ou validação (400)
throw new ClientException('O saldo é insuficiente para esta operação.', 'INSUFFICIENT_FUNDS');

// Exemplo: Recurso não encontrado (404)
throw new ResourceNotFoundException('Cliente não encontrado.', 'CLIENT_NOT_FOUND');

// Exemplo: Conflito de estado (409)
throw new ConflictException('Já existe um agendamento neste horário.', 'SCHEDULE_CONFLICT');
```

**NUNCA** utilize `HttpException` ou `BadRequestException` nativas do NestJS, pois elas não garantem o formato padrão de resposta.

### 1.2 Formato de Resposta (Padrão Automático)
O `GlobalExceptionFilter` intercepta todas as exceções e formata a resposta HTTP para:
```json
{
  "success": false,
  "error": {
    "code": "CLIENT_NOT_FOUND",
    "message": "Cliente com ID 123 não encontrado",
    "timestamp": "2026-06-14T10:30:00Z",
    "path": "/api/clients/123",
    "requestId": "uuid-da-request"
  }
}
```

### 1.3 Logs Estruturados (Winston)
Os logs do sistema são injetados com `LoggerService`. Eles agrupam os erros por `requestId` e enviam para o console (em dev) e Sentry (em prod). Para logar algo importante:
```typescript
this.logger.warn('Tentativa de acesso não autorizada', 'AuthService');
```

---

## 2. Frontend

### 2.1 Fetch com Interceptor
Nunca utilize `fetch` diretamente. Use a função `apiFetch` exportada de `src/lib/api/interceptor.ts`.
Ela implementa **Exponential Backoff** e exibe Toasts (Sonner) automaticamente.

```typescript
import { apiFetch } from '@/lib/api/interceptor';

// Exemplo de uso:
const response = await apiFetch('/api/clients/123', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
```

### 2.2 Tratando Erros Offline e Persistentes
Se o usuário estiver offline ou o backend retornar 500 recorrente, o erro é salvo no `useErrorStore` (Zustand). Ele persiste na sessão para que o usuário saiba o que falhou ao recuperar conexão.

### 2.3 Error Boundary (React)
Para componentes pesados ou propensos a falhas no client-side, utilize o `<ErrorBoundary>`:

```tsx
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export default function ClientsPage() {
  return (
    <ErrorBoundary>
      <ClientList />
    </ErrorBoundary>
  );
}
```
Se `ClientList` quebrar, um Fallback com botão de Retry será renderizado, e o erro será mandado silenciosamente para o Sentry.
