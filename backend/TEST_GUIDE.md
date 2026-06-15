# Guia de Testes - Clickmarido Backend

Este documento serve como referência rápida para o padrão de testes unitários do backend, seguindo o padrão de Factories e Mocks do Prisma.

## Comandos

- `npm run test`: Roda todos os testes unitários.
- `npm run test:cov`: Roda os testes e gera relatórios HTML em `/coverage`.
- `npm run test:watch`: Roda os testes no modo watch, útil durante o desenvolvimento.

## Cobertura Mínima
- Global: 80%
- Services: 85%
- Controllers: 70%

## Mocks do Prisma (`test/mocks/prisma.mock.ts`)

Os testes nunca devem bater no banco real. Injetamos o mock no `TestingModule` da seguinte forma:

```typescript
import { createPrismaMock } from '../../../test/mocks/prisma.mock';

let prismaService: ReturnType<typeof createPrismaMock>;

beforeEach(async () => {
  prismaService = createPrismaMock();
  const module = await Test.createTestingModule({
    providers: [
      MeuService,
      { provide: PrismaService, useValue: prismaService }
    ]
  }).compile();
});
```

A cada teste (`afterEach`), execute `jest.clearAllMocks()`.

## Padrão Factory (`test/factories/`)

Ao instanciar objetos retornados pelo Prisma ou para criar os DTOs de envio, use o método `.build(overrides)` das factories:

```typescript
const company = CompanyFactory.build({ name: 'Nome Customizado' });
```
