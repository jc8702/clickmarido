import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Tenta usar a DIRECT_URL primeiro, pois funciona sem PgBouncer
    let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    
    // Se a string de conexão for do pooler do Supabase e estiver falhando (ENOTFOUND),
    // vamos reescrevê-la para o formato direto (db.[ref].supabase.co)
    if (connectionString && connectionString.includes('pooler.supabase.com')) {
      const match = connectionString.match(/postgres\.([a-z0-9]+):/);
      if (match) {
        const ref = match[1];
        connectionString = connectionString
          .replace('postgres.' + ref, 'postgres')
          .replace(/aws-\d+-[a-z0-9-]+\.pooler\.supabase\.com:\d+/, 'db.' + ref + '.supabase.co:5432')
          .replace('?pgbouncer=true', '');
        // Limpa param final se terminar em interrogação
        if (connectionString.endsWith('?')) connectionString = connectionString.slice(0, -1);
      }
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
