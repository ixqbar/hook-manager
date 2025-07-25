import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'HookManager',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'iife') return 'hook-manager.min.js'
        return `hook-manager.${format}.js`
      }
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  },
  plugins: [dts({ insertTypesEntry: true })]
})