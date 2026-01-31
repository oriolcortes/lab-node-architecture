// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint'; // parser + plugin + configs (flat)
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  // Reglas base JS
  js.configs.recommended,

  // Reglas TypeScript con type-checking (requiere parserOptions.project)
  ...tseslint.configs.recommendedTypeChecked,

  // Bloque general para TS
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json', // tsconfig para lint con tipos (incluye tests)
      },
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      jest, // lo registramos aquí para que esté disponible
    },
    rules: {
      // Tus ajustes TS
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // agrega aquí tus reglas personalizadas
    },
  },

  // Bloque específico para tests (habilita globals de Jest y aplica sus reglas)
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest, // <- describe, it, expect, beforeAll, etc.
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...jest.configs.style.rules,
      // Puedes afinar:
      'jest/expect-expect': 'warn',
      'jest/no-disabled-tests': 'warn',
    },
  },
];
