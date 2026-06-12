const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
console.log('Testando conexão com:', connectionString ? connectionString.substring(0, 50) + '...' : 'undefined');

if (!connectionString) {
  console.error('DATABASE_URL não definida');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Enviando consulta...');
  const users = await prisma.user.findMany();
  console.log('Sucesso! Usuários encontrados:', users.length);
  if (users.length > 0) {
    console.log('Primeiro usuário:', users[0].email);
  }
}

main()
  .catch(err => {
    console.error('Erro na conexão:', err);
  })
  .finally(() => prisma.$disconnect());
