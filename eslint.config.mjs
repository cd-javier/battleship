import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser, // Define browser globals
    },
    rules: {
      'no-unused-vars': 1, // Warn about unused variables
      'no-console': 1, // Warn about console statements
      'prefer-const': 1,
      semi: [2, 'always'], // Force semicolons
      quotes: [2, 'single'], // Force single quotes
    },
    ignores: ['node_modules/**', 'dist/**'], // Add your ignore patterns here
  },
  pluginJs.configs.recommended, // Use recommended rules from ESLint JS plugin
];
