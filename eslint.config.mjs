import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import esLintPluginNext from '@next/eslint-plugin-next';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin'

// noinspection JSCheckFunctionSignatures,JSUnresolvedReference
export default tseslint.config(
  esLintPluginNext.flatConfig.recommended,
  esLintPluginNext.flatConfig.coreWebVitals,
  {
    files: ["**/*.ts", "**/*.tsx"],

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
    ],

    // Skip this if you don't use `eslint-plugin-react-hooks`
    plugins: {
      "react-hooks": eslintPluginReactHooks,
      '@stylistic': stylistic
    },

    languageOptions: {
      // TypeScript ESLint parser for TS files
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // Custom rule to overwrite/modify or to disable if necessary
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/max-len': ['error', 120],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
    },
  },
);
