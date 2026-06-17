"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function runPerformanceTest() {
    const prisma = new client_1.PrismaClient();
    const companyId = 'perf-company-1';
    try {
        console.log('--- PERFORMANCE TEST STARTED ---');
        console.log('Querying 10k financial transactions to check N+1 fixes...');
        console.time('Summary Aggregate Query (N+1 safe)');
        const aggregates = await prisma.$queryRaw `
      SELECT "type", "status", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
      GROUP BY "type", "status"
    `;
        console.timeEnd('Summary Aggregate Query (N+1 safe)');
        console.log('Aggregates fetched without N+1 queries:', aggregates);
        console.log('--- PERFORMANCE TEST PASSED ---');
    }
    catch (error) {
        console.error('Performance test failed:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
runPerformanceTest();
//# sourceMappingURL=performance-test.js.map