import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Code that runs on the server needs no browser, so its tests run in plain Node.
const nodeTests = [
  'tests/server/**',
  'tests/api/**',
  'tests/shared/**',
  'tests/ai/client.test.js',
  'tests/lesson/{progress,reducer}.test.js',
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    setupFiles: ['./tests/setup.js'],
    projects: [
      { extends: true, test: { name: 'node', environment: 'node', include: nodeTests } },
      {
        extends: true,
        test: {
          name: 'browser-like',
          environment: 'jsdom',
          include: ['tests/**/*.test.{js,jsx}'],
          exclude: nodeTests,
        },
      },
    ],
  },
})
