# Guia de Refatoração e Padrões de Arquitetura Frontend

Este documento descreve os padrões adotados para o frontend do **ClickMarido** durante o processo de modernização e refatoração da arquitetura.

## Princípios Básicos
- **Composição sobre Herança:** Componentes grandes devem ser quebrados em partes menores e reutilizáveis.
- **Isolamento de Responsabilidade:** Cada arquivo/componente deve ter uma única responsabilidade.
- **Gerenciamento de Estado Previsível:** O estado global deve usar Zustand; estados locais de módulos complexos devem usar a Context API.

## 1. Context API vs Zustand

### Quando usar Zustand?
Use Zustand para estados globais ou cross-módulo. Por exemplo:
- Dados do Usuário Logado
- Tema da Aplicação (Dark/Light mode)
- Estado de Notificações
- Exemplo: `src/store/use-global-store.ts`

### Quando usar Context API?
Use Context API para estados complexos dentro de uma rota ou módulo de feature específico, evitando prop-drilling, mas não poluindo o estado global.
- Exemplo: `src/contexts/client-context.tsx` que gerencia modais de criação/edição e fetch de lista de clientes apenas dentro da rota `/clientes`.
- Exemplo: `src/contexts/appointment-context.tsx` que carrega a lista de técnicos, OSs e lida com validações do Modal de Agendamentos.

## 2. Refatorando Pages Massivas

As rotas no Next.js App Router (ex: `app/(dashboard)/clientes/page.tsx`) devem atuar apenas como **Orquestradores**. 

**Regras para Pages:**
- Nenhuma marcação UI extensa.
- Nenhum `useState` ou lógica de dados pesada no mesmo arquivo.
- Se a página for complexa, crie um arquivo `<Feature>View` ou um `Context` para englobar os componentes menores.

**Exemplo:**
```tsx
// ❌ Ruim: Page com 500+ linhas, estados misturados, fetch, forms.

// ✅ Bom: Page enxuta com Context Provider
export default function ClientesPage() {
  return (
    <ClientProvider>
      <ClientesView />
    </ClientProvider>
  );
}

// ClientesView:
function ClientesView() {
  return (
    <div className="space-y-10">
      <PageHeader />
      <ClientsFilters />
      <ClientsTable />
      <ClientFormModal />
    </div>
  );
}
```

## 3. Padrões de Componentes Extraídos

Componentes devem ser extraídos para pastas específicas da feature, ex: `src/components/clientes/`.

- **Modais (`client-form-modal.tsx`):** Devem consumir seu estado (aberto/fechado, dados) do Contexto, ou receber via props se for genérico.
- **Tabelas (`clients-table.tsx`):** Consomem os dados carregados do custom hook / contexto. Paginação deve estar delegada a um subcomponente reutilizável (`DataTablePagination`).
- **Filtros (`clients-filters.tsx`):** Centraliza inputs de busca e dropdowns, atualizando os estados de filtro no contexto ou no custom hook debounced.

## 4. Validação de Formulários e APIs

### Zod para Schemas
Todos os formulários que crescem além de 3 campos ou que precisam de validação condicional devem adotar `Zod`.
- Exemplo: `src/schemas/appointment.schema.ts` valida datas (data final maior que data inicial) e garante a presença dos dados mínimos antes da submissão da API.

### Custom Hooks para Fetch (SWR)
Toda listagem deve usar o SWR para garantir caching e evitar re-renders ou chamadas de API duplicadas. Se for muito complexo, extrair para um hook customizado.
- Exemplo: `useClientsData()` gerencia o cache key para paginação e busca, retornando o objeto de listagem pronto para a Tabela.

## Resumo das Etapas para Novas Features
1. Definir os dados que a feature consome (`types` + schema Zod).
2. Criar o Hook de data fetch (`useSWR`).
3. Se a página for muito complexa e tiver modais/filtros, criar um `Context`.
4. Desenvolver a UI quebrando em: `View`, `Filters`, `Table`, `Modals`.
5. Integrar na `Page` principal envelopando com os Providers necessários.
