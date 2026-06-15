# Guia de Testes do Frontend (Vitest + React Testing Library)

Este documento serve como referência para a equipe na hora de criar, manter e debugar testes no frontend do ClickMarido.

## Stack de Testes
- **Vitest**: Test runner rápido, compatível com a sintaxe do Jest.
- **React Testing Library (RTL)**: Focado em testar a aplicação como um usuário faria (ex: buscar por textos na tela, clicar em botões).
- **MSW (Mock Service Worker)**: Intercepta requisições de rede feitas pela aplicação (via `axios`, `fetch`, `SWR`) e retorna respostas mockadas.

## Como Executar
```bash
# Rodar todos os testes
npm run test

# Rodar testes com watch (para desenvolvimento)
npx vitest

# Gerar relatório de coverage (mínimo exigido é 75%)
npm run test:cov
```

## Arquitetura e Configuração
1. **`vitest.config.ts`**: Configura o ambiente jsdom e a meta de cobertura (threshold) de 75% em todas as frentes (lines, branches, functions, statements).
2. **`vitest.setup.ts`**: Inicializa o servidor do MSW antes dos testes, limpa as chamadas a cada teste e encerra ao final. Também provê mocks globais (`matchMedia`, `ResizeObserver`).
3. **`src/test/test-utils.tsx`**: Contém o `customRender`. Sempre importe o render a partir deste arquivo para garantir que Providers globais (`SessionProvider`, `ThemeProvider`) estejam envolvidos.
4. **`src/test/mocks/handlers.ts`**: Onde definimos os mocks de API para que os testes não façam requisições reais ao backend.

## Padrões de Escrita de Teste

### 1. Testes de Acessibilidade
Sempre valide atributos como `aria-disabled`, `aria-busy`, ou `aria-invalid` em componentes de UI base (Botões, Inputs, etc.). Use `screen.getByRole` preferencialmente.

### 2. Custom Render
Nos componentes ou páginas, ao invés de importar de `@testing-library/react`, importe de `@/test/test-utils`:

```tsx
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';

test('Exemplo', async () => {
  render(<MeuComponente />); // Providers já injetados!
});
```

### 3. Simulando Interações do Usuário
Utilize o `userEvent` do RTL ao invés do `fireEvent`, pois ele simula comportamentos mais realistas (como focus, cliques múltiplos, digitação character-by-character).

### 4. Mocks de Contexto Específicos
Se um componente requer mocks que não devem estar no `test-utils`, faça o mock direto no arquivo usando `vi.mock`.

## Regras Importantes
- **Mantenha os mocks da MSW atualizados** com o contrato da API do backend. Se a API mudar as rotas `/api-json/clients`, os handlers devem ser ajustados.
- **Não ignore as falhas de coverage.** Se a cobertura cair abaixo de 75%, o build do CI falhará.
- **Teste comportamentos, não implementação interna.** Teste se ao clicar num botão algo acontece na tela, não se uma função interna X foi chamada com Y.
