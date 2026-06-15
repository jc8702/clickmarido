# API Changelog

Todas as mudanças significativas na API do Click Marido (novas funcionalidades, endpoints deprecados e refatorações) serão listadas aqui.
Seguimos o Versionamento Semântico (SemVer).

## [1.0.0] - 2026-06-14
### Added
- Documentação automática via Swagger/OpenAPI.
- Integração e plugin `@nestjs/swagger` ativos no `nest-cli.json` para inferência de tipos.
- Decorators implementados em todos os principais módulos (Clients, Auth, Financial, Quotes, Appointments, etc).
- Script `swagger:gen` para geração do arquivo estático `openapi.json` e exportação nativa de um `clickmarido.postman_collection.json`.
- A interface de Try-it-out já aceita Autenticação Global JWT.

---
*Nota: Endpoints que sofrerem breaking changes devem ser marcados com `@ApiExtension('x-deprecated', true)` antes de serem totalmente removidos.*
