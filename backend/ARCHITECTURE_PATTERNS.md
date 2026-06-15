# Padrões de Arquitetura - ClickMarido Backend

Este documento serve como a **Fonte da Verdade** para a arquitetura do backend do projeto ClickMarido. Nós utilizamos uma adaptação de Clean Architecture com princípios SOLID, focada em performance e manutenibilidade.

## 1. Padrão Repository

O acesso a banco de dados (Prisma) não deve ocorrer diretamente nos `Services` de negócios. Ele deve estar restrito às classes de `Repository`.

### Responsabilidades do Repository
- Consultar, inserir, atualizar e deletar dados.
- Lidar com otimizações de query (evitar N+1 com uso de `include` e `select` otimizados).
- Expor métodos granulares e previsíveis (`findById`, `findMany`, `create`, `update`).
- Garantir transações explícitas onde necessário.

**Exemplo:**
```typescript
@Injectable()
export class ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, include?: Prisma.ClientInclude) {
    return this.prisma.client.findUniqueOrThrow({
      where: { id },
      include: include || { contacts: true, addresses: true },
    });
  }
}
```

## 2. Separação de Responsabilidades (Services)

Classes de serviço (`X.service.ts`) não devem ultrapassar 300 linhas. Para garantir isso:
- **Validation Services:** Lógica extensa de checagem de regras de negócio (e.g. `ClientValidationService`) deve ser extraída.
- **Utility / Domain Services:** Lógicas computacionais (e.g. cálculos financeiros) devem residir em serviços utilitários puros (e.g. `CalculationService`, `ReportGeneratorService`).
- O Service principal atua como um **Orquestrador**, conectando a Validação, o Repositório e utilitários de terceiros (Logs, Geo).

## 3. Gestão de Transações e Concorrência

- **Transações:** Sempre utilizar `this.prisma.$transaction` quando múltiplas inserções/atualizações dependentes ocorrerem na mesma request (ex: criar Cliente + Histórico).
- **Pessimistic Locking / Concorrência:** Para recursos com concorrência alta, como agendamento de técnicos, utilizar checagens atômicas (quando viável) ou transações encadeadas com validação forte para evitar `double-booking`.

## 4. Tratamento de Erros

Exceções devem ser lançadas o mais cedo possível:
- Use `BadRequestException` para erros de input do usuário ou falha em regra de negócio (CPF duplicado).
- Use `NotFoundException` para recursos inexistentes ou excluídos via soft-delete.
- Erros inesperados em integrações devem logar no sistema (`LoggerService`) e lançar exceções não sensíveis (InternalServerError) ou controladas.

## 5. Performance

- **N+1:** É expressamente proibido rodar loops de queries no banco (ex: `for ... { await prisma.x.find() }`). Utilize `$queryRaw` ou views agregadas (`groupBy`, `include` em query única).
- Operações de relatórios densos (DRE, Fluxo de Caixa) devem priorizar processamento dentro do SQL, retornando apenas os resultados consolidados para o Node.js.
