import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // loadPaths позволяет @use "variables" as * без указания пути
        loadPaths: [resolve(__dirname, 'src/styles')],
        // Автоматически добавляется в начало каждого .scss блока
        additionalData: `@use "variables" as *;\n@use "mixins" as *;\n`,
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
