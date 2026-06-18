import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { withPerformanceMonitoring } from '../../common/prisma/prisma.extension';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public readonly extended: ReturnType<typeof withPerformanceMonitoring>;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.extended = withPerformanceMonitoring(this);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Conexão com o banco de dados inicializada com sucesso.');
    } catch (error) {
      console.error(
        '⚠️ Falha ao conectar ao banco de dados na inicialização do modulo Prisma:',
      );
      console.error(error);
      console.warn(
        '⚠️ A aplicação continuará executando, mas as consultas ao banco falharão até que a conexão seja restabelecida.',
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Erro ao desconectar do banco de dados:', error);
    }
  }
}
