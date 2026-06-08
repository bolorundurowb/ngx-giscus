/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: resolve(process.cwd(), 'projects/ngx-giscus/tsconfig.spec.json'),
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    restoreMocks: true,
    setupFiles: ['projects/ngx-giscus/src/test-setup.ts'],
    include: ['projects/ngx-giscus/src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text-summary'],
      reportsDirectory: 'coverage/ngx-giscus',
      exclude: [
        'projects/demo/**',
        '**/*.spec.ts',
        'projects/ngx-giscus/src/public-api.ts',
        'vitest.config.ts',
      ],
    },
  },
});
