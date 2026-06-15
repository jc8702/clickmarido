# Documentação da API - Click Marido

A API do Click Marido é documentada usando a especificação OpenAPI 3.0 via Swagger no framework NestJS.
Esta abordagem garante que o código seja a fonte primária da verdade, gerando contratos de interface sempre atualizados.

## Acessando o Swagger UI

Em ambiente de desenvolvimento, inicie o servidor:
```bash
npm run start:dev
```
Acesse a interface interativa em:
[http://localhost:3001/api/docs](http://localhost:3001/api/docs)

Para obter o JSON bruto da especificação OpenAPI:
[http://localhost:3001/api-json](http://localhost:3001/api-json)

## Autenticação

Todos os endpoints protegidos (que requerem `@UseGuards(JwtAuthGuard)`) devem conter o token JWT.
No Swagger UI, clique no botão **Authorize** no topo direito da página e insira seu token. O NestJS já está configurado para salvar esse token usando o `persistAuthorization`.

## Padrões de Desenvolvimento

Para manter a documentação coesa, siga estas regras ao adicionar novos endpoints:

### Controllers
Todo controller deve ter a tag indicando o módulo:
```typescript
@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController { ... }
```

Cada rota deve descrever o que faz e listar possíveis retornos além do padrão (200/201 é inferido automaticamente, mas os de erro devem ser declarados):
```typescript
@ApiOperation({ summary: 'Cancelar um agendamento' })
@ApiOkResponse({ description: 'Agendamento cancelado com sucesso.' })
@ApiBadRequestResponse({ description: 'Ação inválida para o estado atual.' })
@ApiUnauthorizedResponse({ description: 'Token inválido ou expirado.' })
@Put(':id/cancel')
```

### DTOs
Graças ao plugin CLI `@nestjs/swagger`, a maior parte da tipagem dos DTOs é inferida automaticamente. Porém, para enriquecer a documentação e fornecer exemplos à collection do Postman:
```typescript
export class CreateQuoteDto {
  @ApiProperty({ description: 'Valor total do orçamento', example: 1500.50 })
  @IsNumber()
  amount: number;
}
```

## Postman Collection

Para exportar a API completa para o Postman (com Environments Injetados):
```bash
npm run swagger:gen
```
Isso gerará o arquivo `clickmarido.postman_collection.json` na raiz do backend.
Importe esse arquivo no Postman e configure os Environments com as chaves:
- `baseUrl`: `http://localhost:3001/api`
- `token`: `seu_jwt_aqui`
