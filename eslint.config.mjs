import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const baseConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  extends: fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:prettier/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'next/core-web-vitals',
      'next/typescript',
    ),
  ),

  plugins: {
    'react-hooks': fixupPluginRules(reactHooks),
    '@typescript-eslint': fixupPluginRules(typescriptEslint),
    'simple-import-sort': simpleImportSort,
    prettier: fixupPluginRules(prettier),
    import: fixupPluginRules(eslintPluginImport),
    'unused-imports': fixupPluginRules(unusedImports),
  },

  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
      ...globals.jest,
      jest: true,
      it: true,
      expect: true,
      shallow: true,
    },

    parser: tsParser,
    ecmaVersion: 10,
    sourceType: 'module',

    parserOptions: {
      projectService: true,
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
    },
  },

  settings: {
    react: {
      version: 'detect',
    },

    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },

  rules: {
    'react/jsx-max-props-per-line': [
      2,
      {
        maximum: 1,
        when: 'multiline',
      },
    ],

    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'arrow-body-style': 'error',
    '@typescript-eslint/indent': 'off',
    'react/jsx-curly-brace-presence': 'error',
    'import/no-unused-modules': 'warn',
    'import/namespace': 'off',
    'import/named': 'off',
    'no-unused-vars': 'off',
    'react/prop-types': 'off',
    'import/no-unresolved': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'newline-before-return': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-misused-new': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/no-unused-vars': 'off',

    'no-console': 'warn',

    'prettier/prettier': [
      'error',
      {
        printWidth: 130,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        endOfLine: 'auto',
        arrowParens: 'always',
        jsxSingleQuote: true,
      },
    ],

    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node builtins + react
          ['^node:', '^react', '^next'],
          // External packages
          ['^@?\\w'],
          // Internal aliases — bottom-up (shared → entities/features → components → app)
          ['^@/shared'],
          ['^@/entities', '^@/features'],
          ['^@/components'],
          ['^@/app'],
          // Parent / sibling / index
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Side-effect / styles
          ['^.+\\.s?css$', '^\\u0000'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
};

const testsConfig = {
  files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),
  baseConfig,
  testsConfig,
]);
