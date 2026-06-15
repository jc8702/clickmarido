import { PrometheusController } from '@willsoto/nestjs-prometheus';
export declare class MetricsController extends PrometheusController {
    checkHealth(): {
        status: string;
        timestamp: string;
        services: {
            api: string;
            database: string;
        };
    };
}
