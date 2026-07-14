import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  ...core,
  env: { ...core.env, ...react.env },
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ".claude/agents/**",
    ".claude/skills/**",
    ".codex/**",
    "public/mockServiceWorker.js",
  ],
  overrides: [
    ...(core.overrides ?? []),
    ...(react.overrides ?? []),
    {
      files: ["resources/js/components/ui/**/*.{ts,tsx}"],
      rules: {
        "func-style": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "no-nested-ternary": "off",
        "sort-keys": "off",
      },
    },
    {
      files: ["**/*.d.ts"],
      rules: {
        "import/consistent-type-specifier-style": "off",
        "typescript/consistent-type-imports": "off",
        "typescript/no-import-type-side-effects": "off",
      },
    },
    {
      files: ["oxlint.config.mjs"],
      rules: {
        "sort-keys": "off",
      },
    },
  ],
  plugins: [...new Set([...(core.plugins ?? []), ...(react.plugins ?? [])])],
  rules: {
    ...core.rules,
    ...react.rules,
    "import/consistent-type-specifier-style": "off",
    "import/no-named-as-default-member": "off",
    "jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
    "jsx-a11y/prefer-tag-over-role": "off",
    "no-promise-executor-return": "off",
    "no-shadow": "off",
    "no-use-before-define": "off",
    "promise/avoid-new": "off",
    "promise/prefer-await-to-then": "off",
    "react/hook-use-state": "off",
    "react/jsx-max-depth": "off",
    "react/jsx-no-constructed-context-values": "off",
    "react/no-object-type-as-default-prop": "off",
    "react/no-unstable-nested-components": "off",
    "react-perf/jsx-no-jsx-as-prop": "off",
    "react-perf/jsx-no-new-array-as-prop": "off",
    "react-perf/jsx-no-new-function-as-prop": "off",
    "react-perf/jsx-no-new-object-as-prop": "off",
    "react/react-compiler": "off",
    "sort-imports": "off",
    "typescript/no-invalid-void-type": "off",
    "unicorn/prefer-export-from": "off",
  },
});
