import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "logs/**",
      "prisma/migrations/**",
      "prisma/generated/**",
      "prisma/client/**",
      "src/generated/prisma/**",
      "documents/",
    ],
  },
  eslint.configs.recommended,
  // TS recommended (parser + base rules)
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,cts,mts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    plugins: {
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // stylistic (same as JS, via @stylistic)
      "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],

      // TS-aware rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // turn off base overlap
      "no-unused-vars": "off",
    },
  },
]);
