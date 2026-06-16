import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando semeadura do banco de dados (Seed)...');

  // 1. Criar a Company (Empresa) padrão de teste
  const company = await prisma.company.upsert({
    where: { slug: 'matriz-sp' },
    update: {},
    create: {
      name: 'Click Marido Matriz SP',
      slug: 'matriz-sp',
      cnpj: '12345678000199',
      phone: '11999999999',
      email: 'matriz@clickmarido.com.br',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      active: true,
    },
  });
  console.log(`🏢 Empresa padrão criada/verificada: ${company.name}`);

  // 2. Criar as Permissões do sistema
  const permissionsList = [
    { action: '*', description: 'Acesso total de administrador' },
    { action: 'client:create', description: 'Criar novos clientes' },
    { action: 'client:read', description: 'Visualizar informações de clientes' },
    { action: 'client:update', description: 'Atualizar dados de clientes' },
    { action: 'client:delete', description: 'Excluir clientes do sistema' },
    { action: 'service:create', description: 'Criar ordens de serviço' },
    { action: 'service:read', description: 'Visualizar ordens de serviço' },
    { action: 'service:update', description: 'Atualizar ordens de serviço' },
    { action: 'service:delete', description: 'Excluir ordens de serviço' },
    { action: 'quote:create', description: 'Criar novos orçamentos' },
    { action: 'quote:read', description: 'Visualizar orçamentos' },
    { action: 'quote:update', description: 'Atualizar orçamentos' },
    { action: 'quote:delete', description: 'Excluir orçamentos' },
    { action: 'user:create', description: 'Criar usuários da empresa' },
    { action: 'user:read', description: 'Visualizar usuários do time' },
    { action: 'user:update', description: 'Atualizar dados de usuários do time' },
    { action: 'user:delete', description: 'Excluir usuários do time' },
    { action: 'material:create', description: 'Criar novos materiais' },
    { action: 'material:read', description: 'Visualizar materiais' },
    { action: 'material:update', description: 'Atualizar materiais' },
    { action: 'material:delete', description: 'Excluir materiais' },
    { action: 'material:movement', description: 'Registrar movimentações de estoque' },
  ];

  console.log('🔑 Semeando permissões...');
  const permissionsMap = new Map();
  for (const perm of permissionsList) {
    const dbPerm = await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: { action: perm.action, description: perm.description },
    });
    permissionsMap.set(perm.action, dbPerm);
  }

  // 3. Criar os Perfis (Roles) para a Company
  const rolesDefs = [
    {
      name: 'Administrador',
      description: 'Acesso administrativo completo',
      permissions: ['*'],
    },
    {
      name: 'Gestor',
      description: 'Gestor operacional com amplos poderes de escrita',
      permissions: [
        'client:create', 'client:read', 'client:update',
        'service:create', 'service:read', 'service:update',
        'quote:create', 'quote:read', 'quote:update',
        'user:create', 'user:read', 'user:update', 'user:delete',
        'material:create', 'material:read', 'material:update', 'material:delete', 'material:movement',
      ],
    },
    {
      name: 'Atendente',
      description: 'Responsável pelo atendimento e cadastro de clientes',
      permissions: [
        'client:create', 'client:read', 'client:update',
        'service:read',
        'quote:read',
        'material:read',
      ],
    },
    {
      name: 'Financeiro',
      description: 'Responsável pelo faturamento e liberação de orçamentos',
      permissions: [
        'client:read',
        'service:read',
        'quote:read', 'quote:update'
      ],
    },
    {
      name: 'Técnico',
      description: 'Profissional de campo que executa serviços',
      permissions: [
        'client:read',
        'service:read', 'service:update', // Técnico pode atualizar status do serviço
        'material:read',
      ],
    },
  ];

  console.log('👤 Semeando papéis (Roles) e associando permissões...');
  const rolesMap = new Map();
  for (const roleDef of rolesDefs) {
    // Busca os ids correspondentes das permissões definidas
    const connectPermissions = roleDef.permissions.map((action) => ({
      id: permissionsMap.get(action).id,
    }));

    const role = await prisma.role.upsert({
      where: {
        name_companyId: {
          name: roleDef.name,
          companyId: company.id,
        },
      },
      update: {
        permissions: {
          set: connectPermissions,
        },
      },
      create: {
        name: roleDef.name,
        description: roleDef.description,
        companyId: company.id,
        permissions: {
          connect: connectPermissions,
        },
      },
    });
    rolesMap.set(roleDef.name, role);
    console.log(` - Papel "${roleDef.name}" semeado com ${roleDef.permissions.length} permissões`);
  }

  // 4. Criar Usuários de Teste correspondentes a cada perfil
  const userPasswordHash = await bcrypt.hash('senha123', 10);
  const usersDefs = [
    { email: 'admin@clickmarido.com.br', name: 'João Admin', roleName: 'Administrador' },
    { email: 'gestor@clickmarido.com.br', name: 'Pedro Gestor', roleName: 'Gestor' },
    { email: 'atendente@clickmarido.com.br', name: 'Ana Atendente', roleName: 'Atendente' },
    { email: 'financeiro@clickmarido.com.br', name: 'Luísa Financeiro', roleName: 'Financeiro' },
    { email: 'tecnico@clickmarido.com.br', name: 'Carlos Técnico', roleName: 'Técnico' },
  ];

  console.log('👥 Semeando usuários de teste (Senha padrão: "senha123")...');
  for (const userDef of usersDefs) {
    const role = rolesMap.get(userDef.roleName);
    
    const user = await prisma.user.upsert({
      where: { email: userDef.email },
      update: {
        roles: {
          set: [{ id: role.id }],
        },
      },
      create: {
        email: userDef.email,
        name: userDef.name,
        password: userPasswordHash,
        companyId: company.id,
        isActive: true,
        roles: {
          connect: [{ id: role.id }],
        },
      },
    });
    console.log(` - Usuário "${user.name}" (${user.email}) -> Perfil: ${userDef.roleName}`);
  }

  // 5. Semeando Catálogo de Serviços padrão
  console.log('🛠️ Removendo catálogo antigo e semeando 83 novos serviços...');

  // Remove todos os serviços existentes da empresa (hard delete para limpeza do seed)
  await prisma.service.deleteMany({
    where: { companyId: company.id },
  });

  // Importa os 83 serviços do arquivo de dados
  const servicesDefs: Array<{
    name: string;
    category: string;
    description: string;
    value: number;
    averageTime: number;
    complexity: string;
    warranty: number;
  }> = require('./services-data.json');

  for (const sDef of servicesDefs) {
    await prisma.service.create({
      data: {
        ...sDef,
        companyId: company.id,
      },
    });
  }
  console.log(` - Semeados ${servicesDefs.length} serviços no catálogo Click Marido.`);

  console.log('✅ Semeadura concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a semeadura:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
