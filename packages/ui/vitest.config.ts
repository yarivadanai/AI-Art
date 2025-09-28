import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      lines: 0.75,
      functions: 0.75,
      statements: 0.75,
    },
  },
});
