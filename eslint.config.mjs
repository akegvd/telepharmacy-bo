import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import storybook from 'eslint-plugin-storybook';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      // Arrow functions everywhere — no `function` declarations or expressions.
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'error',

      // Sort imports + group imports + organize imports
      'import/order': [
        'error',
        {
          // Very close to TypeScript organizeImports
          groups: [
            'builtin', // fs, path
            'external', // react, next, @mui/*
            'internal', // @/...
            'parent', // ../
            'sibling', // ./
            'index', // ./index
            'type', // import type {}
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@mui/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],

          // Newlines between imports
          'newlines-between': 'always',

          // Alphabetical order (TS behavior)
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          // Ensure type imports are grouped last
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
  prettierRecommended,
  {
    rules: {
      // Re-enabled after prettierRecommended, which turns `curly` off by default.
      // `all` is safe with Prettier: bodies are always braced and expanded onto their own lines.
      curly: ['error', 'all'],
    },
  },
]);

export default eslintConfig;
