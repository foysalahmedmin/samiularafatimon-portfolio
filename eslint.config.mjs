import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noParentRelative = {
  regex: "^\\.\\./",
  message: "Use the '@/' alias instead of parent-relative imports.",
};

const contentOnlyViaAccessors = {
  group: ["@content", "@content/*"],
  message: "UI code must not import content directly. Use the accessors in '@/lib/content'.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // UI and routes: no direct content imports, no parent-relative imports.
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [noParentRelative, contentOnlyViaAccessors] }],
    },
  },

  // The accessor layer is the one place allowed to read content.
  {
    files: ["src/lib/content/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [noParentRelative] }],
    },
  },

  // Content is plain data: only type imports from src, no UI frameworks.
  {
    files: ["content/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/*"],
              allowTypeImports: true,
              message: "Content is plain data: only `import type` from src is allowed.",
            },
            {
              group: ["react", "react-dom", "next", "next/*"],
              message: "Content must not depend on React or Next.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
