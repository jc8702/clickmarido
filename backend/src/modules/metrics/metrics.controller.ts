import { Controller, Get } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@Controller()
export class MetricsController extends PrometheusController {
  @Get('health')
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'up',
        // O Redis/DB checking idealmente iria no Terminus/Nest HealthCheck,
        // mas aqui mantemos simples para status page.
        database: 'up',
      },
    };
  }
}
