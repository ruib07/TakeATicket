import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
        beforeAll: "readonly",
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "error",
    },
  },
];
