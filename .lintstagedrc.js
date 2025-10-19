module.exports = {
  // Run ESLint on TypeScript and JavaScript files
  "**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],

  // Format other files with Prettier
  "**/*.{json,css,md,mdx}": ["prettier --write"],

  // Type check TypeScript files
  "**/*.{ts,tsx}": () => "tsc --noEmit",
};
