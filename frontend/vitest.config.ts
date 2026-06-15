import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: ['node_modules/**', '.next/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        '.next/**',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'next.config.mjs',
        'vitest.config.ts',
        'vitest.setup.ts',
        'playwright.config.ts',
        'e2e/**',
        'src/components/ui/data-table-pagination.tsx',
        'src/components/ui/skeleton-table.tsx',
        'src/test/**'
      ],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
