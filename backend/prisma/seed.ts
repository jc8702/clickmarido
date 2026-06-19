import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test company
  const company = await prisma.company.create({
    data: {
      name: 'Click Marido Test',
      cnpj: '12.345.678/0001-99',
      phone: '(11) 99999-9999',
      email: 'contato@clickmarido.com',
      address: 'Rua Teste, 123, São Paulo, SP',
    },
  });

  console.log('✅ Created company:', company.name);

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'admin@clickmarido.com',
      name: 'Administrador',
      password: hashedPassword,
      companyId: company.id,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created user:', user.name);

  // Create some sample service orders
  const serviceOrders = await Promise.all([
    prisma.serviceOrder.create({
      data: {
        title: 'Reparo de máquina de lavar',
        description: 'A máquina não está drenando água corretamente',
        status: 'OPEN',
        priority: 'HIGH',
        value: 150.00,
        estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        companyId: company.id,
        userId: user.id,
      },
    }),
    prisma.serviceOrder.create({
      data: {
        title: 'Manutenção de ar-condicionado',
        description: 'Ar-condicionado não está esfriando',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        value: 200.00,
        estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        companyId: company.id,
        userId: user.id,
      },
    }),
    prisma.serviceOrder.create({
      data: {
        title: 'Instalação de chuveiro elétrico',
        description: 'Instalação de novo chuveiro elétrico',
        status: 'COMPLETED',
        priority: 'LOW',
        value: 80.00,
        estimatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(),
        companyId: company.id,
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created service orders:', serviceOrders.length);

  // Create some sample quotes
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        value: 120.00,
        description: 'Mão de obra e peças',
        serviceOrderId: serviceOrders[0].id,
      },
    }),
    prisma.quote.create({
      data: {
        value: 180.00,
        description: 'Manutenção preventiva',
        serviceOrderId: serviceOrders[1].id,
      },
    }),
  ]);

  console.log('✅ Created quotes:', quotes.length);

  // Create some sample payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        value: 120.00,
        status: 'PAID',
        method: 'CASH',
        serviceOrderId: serviceOrders[0].id,
        quoteId: quotes[0].id,
      },
    }),
    prisma.payment.create({
      data: {
        value: 90.00,
        status: 'PENDING',
        method: 'BANK_TRANSFER',
        serviceOrderId: serviceOrders[1].id,
      },
    }),
  ]);

  console.log('✅ Created payments:', payments.length);

  // Create some sample warranties
  const warranties = await Promise.all([
    prisma.warranty.create({
      data: {
        title: 'Garantia do reparo',
        description: 'Garantia de 30 dias para o reparo da máquina de lavar',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        companyId: company.id,
        serviceOrderId: serviceOrders[0].id,
        userId: user.id,
      },
    }),
    prisma.warranty.create({
      data: {
        title: 'Garantia da manutenção',
        description: 'Garantia de 90 dias para manutenção do ar-condicionado',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        companyId: company.id,
        serviceOrderId: serviceOrders[1].id,
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created warranties:', warranties.length);

  // Create some sample reports
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        type: 'SERVICE_ORDERS',
        title: 'Relatório de Ordens de Serviço',
        data: {
          totalOrders: 3,
          completedOrders: 1,
          pendingOrders: 2,
          totalValue: 430.00,
        },
        companyId: company.id,
        userId: user.id,
      },
    }),
    prisma.report.create({
      data: {
        type: 'FINANCIAL',
        title: 'Relatório Financeiro',
        data: {
          totalRevenue: 210.00,
          pendingRevenue: 90.00,
          totalExpenses: 50.00,
          netProfit: 160.00,
        },
        companyId: company.id,
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created reports:', reports.length);

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Login credentials:');
  console.log('Email: admin@clickmarido.com');
  console.log('Password: password123');
  console.log('');
  console.log('You can now start the development servers:');
  console.log('Backend: npm start:dev');
  console.log('Frontend: npm run dev');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });