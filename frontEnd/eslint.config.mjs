import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint Configuration
const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", // Recommended Next.js linting rules for Core Web Vitals
    "next/typescript"       // Linting rules for TypeScript in Next.js
  ),
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply rules to TypeScript files
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable 'no-unused-vars' rule
    },
  },
];

export default eslintConfig;
