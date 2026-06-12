const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Millena%40%402017%40%40@db.ydfoplwjidtrfkibgcvi.supabase.co:5432/postgres'
    }
  }
});
async function main() {
  const users = await prisma.user.findMany();
  console.log('Users count:', users.length);
  if (users.length > 0) {
    console.log(users[0].email);
  }
}
main().finally(() => prisma.$disconnect());
