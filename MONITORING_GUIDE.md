# Guia de Monitoramento e Observabilidade

Para manter o alto nível de disponibilidade e visibilidade técnica da aplicação ClickMarido, seguimos a abordagem de Observabilidade em 3 pilares: Logs, Metrics e Traces.

## 1. Logs (Winston + Correlation IDs)
O Backend em NestJS não utiliza o `console.log` nativo. 
Utilizamos a biblioteca `winston` que permite:
- Em **Dev**: Formatação legível por humanos e colorida no STDOUT.
- Em **Prod**: Formatação estritamente JSON.
Sempre que logar um request, injete o `reqId` para amarrar a sessão do usuário ou transação em todo o pipeline de chamadas.

## 2. Rastreamento de Erros (Sentry)
O Sentry (`@sentry/nextjs` e `@sentry/node`) captura exceções não tratadas:
- No FrontEnd, gravamos **Session Replays** limitados aos logs de erro, mascarando inputs (PII protection).
- No BackEnd, injetamos alertas automáticos sempre que houver `Error Rate (5xx)` anormal.

### Como visualizar:
Garanta que a variável `NEXT_PUBLIC_SENTRY_DSN` esteja configurada. Erros explodidos serão enviados com a tag da *Release* para fácil rollback.

## 3. Métricas da Aplicação (Prometheus & Grafana)
A API expõe o endpoint `/metrics` utilizando o decorator do Prometheus.
1. O Prometheus faz scrape de `http_requests_total`, duração e métricas de Node.js (CPU/Mem).
2. Para visualizar, importe o arquivo `docs/monitoring/grafana-dashboard.json` em sua instância do Grafana.

## 4. Uptime e Status (Health Checks)
A rota principal `/health` atende chamadas GET sem autenticação para serviços de Ping como Statuspage.io e UptimeRobot. 
Sempre monitore esse endpoint. Se ele falhar por mais de 3 pings (3 minutos), um incidente de P1 (Crítico) deve ser acionado.
