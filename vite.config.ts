/// <reference types="vite/client" />
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    root: "src",
    include: ["**/?(*.)+(spec|test|unit|micro).[jt]s?(x)"],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./scripts/vitest-setup.ts'],
    reporters: ['basic', 'html'],
    outputFile: {
      html:  '../reports/test/test.unit.html'
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['html'],
      reportsDirectory: '../reports/coverage'
    }
  }
})

