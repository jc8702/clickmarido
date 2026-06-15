# Arquitetura de Gerenciamento de Estado (Zustand)

## Motivação
Abandonamos o padrão de *Single Monolithic Store* por um padrão moderno de *Independent Slices* via **Zustand**. Isso facilita a leitura, simplifica os testes isolados de estado e previne problemas de *type-safety* ou properties `undefined` causadas por re-renders descontrolados.

## Estrutura

- `src/store/types.ts`: Define a tipagem da raiz (`RootState`) como a união de todas as Slices.
- `src/store/slices/`: Contém as fatias lógicas independentes do estado (ex: `authSlice.ts`, `clientsSlice.ts`).
- `src/store/useStore.ts`: Inicializa o *Zustand* agregando todas as Slices. Contém os middlewares `devtools` (para tracking no navegador) e `persist` (com `partialize` para salvar no localStorage APENAS o estado essencial como Token ou Tema visual, evitando cache sujo de DB).
- `src/store/selectors.ts`: *Hooks* customizados tipados que atuam como porta de entrada. **Sempre use eles!**

## Boas Práticas

### ❌ O que NÃO fazer:
Consumir a store inteira num componente, causando re-render excessivo sempre que algo mudar:
```tsx
import { useStore } from '../store/useStore';

// PÉSSIMO: Re-renderiza o componente até se o tema global mudar!
const Componente = () => {
  const store = useStore();
  return <p>{store.clients.length} clientes</p>;
};
```

### ✅ O que FAZER:
Sempre importe os hooks pré-moldados no arquivo `selectors.ts`. Eles mapeiam as propriedades reativas de forma estrita.

```tsx
import { useClients } from '../store/selectors';

const ListaClientes = () => {
  const { clients, loading } = useClients(); // Só re-renderiza quando 'clients' ou 'loading' mudarem!
  
  if (loading) return <Spinner />;
  return <ul>{clients.map(c => <li>{c.name}</li>)}</ul>;
};
```
