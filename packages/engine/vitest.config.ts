import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'html'],
      lines: 0.85,
      functions: 0.85,
      statements: 0.85,
    },
  },
});
