import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: [
      '**/*.spec.ts', '**/*.test.ts', 
      '**/*.spec.tsx', '**/*.test.tsx', 
      '**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', 
      '**/test/**/*.ts', '**/test/**/*.tsx', 
      '**/mocks/**/*.ts', '**/mocks/**/*.tsx'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "node_modules/**",
    "dist/**",
    "src/lib/api/generated/**",
  ]),
]);

export default eslintConfig;
