"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPerformanceMonitoring = withPerformanceMonitoring;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('DATABASE_PERFORMANCE');
const QUERY_THRESHOLD_MS = 100;
function withPerformanceMonitoring(prisma) {
    return prisma.$extends({
        query: {
            async $allOperations({ operation, model, args, query }) {
                const start = Date.now();
                const result = await query(args);
                const duration = Date.now() - start;
                logger.debug(`[DB Query] ${model || 'Raw'}.${operation} took ${duration}ms`);
                if (duration > QUERY_THRESHOLD_MS) {
                    logger.warn(`[SLOW QUERY ALERT] ${model || 'Raw'}.${operation} took ${duration}ms (Threshold: ${QUERY_THRESHOLD_MS}ms)`);
                }
                return result;
            },
        },
    });
}
//# sourceMappingURL=prisma.extension.js.map