import { defineConfig } from 'prisma/extension';

export default defineConfig({
  datasources: {
    db: {
      url: env('DATABASE_URL'),
    },
  },
});