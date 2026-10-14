import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'server/src/generated/**',
      'test-results/**',
      'playwright-report/**',
      'blob-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Plain JS/MJS files (e.g. server scripts) run on Node.
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    rules: {
      // Prefer `() => value` over `() => { return value; }`.
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error',
      // Underscore-prefixed names are intentionally unused (e.g. Express `_next`).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Must stay last: turns off rules that conflict with Prettier formatting.
  prettier,
);
