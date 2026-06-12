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
  console.log('🛠️ Semeando Catálogo de Serviços padrão da Click Marido...');
  const servicesDefs = [
    // Elétrica
    {
      category: 'Elétrica',
      name: 'Instalação de Chuveiro Elétrico',
      description: 'Substituição ou instalação nova de chuveiro, incluindo conexão elétrica e testes de fluxo/temperatura.',
      value: 120.00,
      averageTime: 45,
      complexity: 'Média',
      warranty: 90,
      specialty: 'Eletricista Residencial',
    },
    {
      category: 'Elétrica',
      name: 'Instalação de Ventilador de Teto',
      description: 'Montagem e fixação de ventilador de teto com instalação de chave controladora na parede.',
      value: 180.00,
      averageTime: 90,
      complexity: 'Alta',
      warranty: 90,
      specialty: 'Eletricista Residencial',
    },
    {
      category: 'Elétrica',
      name: 'Troca de Disjuntor ou Tomada',
      description: 'Substituição de tomadas antigas ou disjuntores avariados no quadro de distribuição.',
      value: 50.00,
      averageTime: 25,
      complexity: 'Baixa',
      warranty: 90,
      specialty: 'Eletricista Residencial',
    },
    // Hidráulica
    {
      category: 'Hidráulica',
      name: 'Conserto de Vazamento em Torneira',
      description: 'Substituição de reparo (carrapeta) ou troca completa da torneira ou misturador.',
      value: 70.00,
      averageTime: 30,
      complexity: 'Baixa',
      warranty: 90,
      specialty: 'Encanador',
    },
    {
      category: 'Hidráulica',
      name: 'Desentupimento de Vaso Sanitário ou Ralo',
      description: 'Desobstrução de encanamento de esgoto interno utilizando equipamentos manuais específicos.',
      value: 160.00,
      averageTime: 60,
      complexity: 'Média',
      warranty: 30,
      specialty: 'Encanador de Esgoto',
    },
    {
      category: 'Hidráulica',
      name: 'Limpeza de Caixa d\'Água',
      description: 'Esvaziamento, higienização interna e desinfecção de reservatórios de até 1.000 litros.',
      value: 250.00,
      averageTime: 120,
      complexity: 'Média',
      warranty: 180,
      specialty: 'Auxiliar Hidráulico',
    },
    // Instalações
    {
      category: 'Instalações',
      name: 'Instalação de Suporte de TV',
      description: 'Fixação de suporte fixo ou articulado em parede de alvenaria ou painel de madeira com passador de cabos.',
      value: 90.00,
      averageTime: 40,
      complexity: 'Baixa',
      warranty: 90,
      specialty: 'Instalador de Painéis',
    },
    {
      category: 'Instalações',
      name: 'Instalação de Cortina ou Persiana',
      description: 'Marcação, furação e fixação de suportes e trilhos para cortinas e persianas residenciais.',
      value: 80.00,
      averageTime: 45,
      complexity: 'Baixa',
      warranty: 90,
      specialty: 'Instalador Geral',
    },
    {
      category: 'Instalações',
      name: 'Instalação de Purificador de Água',
      description: 'Conexão hidráulica no ponto de água, fixação do purificador e ativação do refil.',
      value: 60.00,
      averageTime: 30,
      complexity: 'Baixa',
      warranty: 90,
      specialty: 'Instalador Geral',
    },
    // Marcenaria
    {
      category: 'Marcenaria',
      name: 'Regulagem de Portas e Gavetas',
      description: 'Ajuste de dobradiças, troca de corrediças telescópicas simples e alinhamento de portas de armários.',
      value: 110.00,
      averageTime: 60,
      complexity: 'Média',
      warranty: 90,
      specialty: 'Marceneiro de Ajustes',
    },
    {
      category: 'Marcenaria',
      name: 'Montagem de Guarda-Roupa (Até 6 Portas)',
      description: 'Montagem completa de guarda-roupa de casal a partir do manual do fabricante.',
      value: 290.00,
      averageTime: 240,
      complexity: 'Alta',
      warranty: 90,
      specialty: 'Montador Profissional',
    },
    {
      category: 'Marcenaria',
      name: 'Troca de Puxadores ou Dobradiças',
      description: 'Substituição de puxadores de armários e gavetas ou troca de dobradiças do tipo caneco.',
      value: 70.00,
      averageTime: 40,
      complexity: 'Baixa',
      warranty: 90,
      specialty: 'Auxiliar de Marcenaria',
    },
  ];

  for (const sDef of servicesDefs) {
    const existing = await prisma.service.findFirst({
      where: {
        name: sDef.name,
        category: sDef.category,
        companyId: company.id,
        deletedAt: null,
      },
    });

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: sDef,
      });
    } else {
      await prisma.service.create({
        data: {
          ...sDef,
          companyId: company.id,
        },
      });
    }
  }
  console.log(` - Semeados/atualizados ${servicesDefs.length} serviços no catálogo base Click Marido.`);

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
