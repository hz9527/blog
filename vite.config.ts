import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import plugin from './scripts/buildPlugins/plugin'
import JSX from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    polyfillDynamicImport: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        404: resolve(__dirname, '404.html')
      }
    }
  },
  server: {
    proxy: {
      '/blog': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/blog/, '')
      }
    }
  },
  plugins: [
    vue(),
    JSX(),
    plugin()
  ]
})
