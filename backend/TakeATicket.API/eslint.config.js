import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
        jest: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: ['jest'],
    extends: ['plugin:jest/recommended'],
  },
];
