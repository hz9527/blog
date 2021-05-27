import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import JSX from '@vitejs/plugin-vue-jsx'
import plugin from './scripts/buildPlugins/plugin'
import swPlugin from './scripts/buildPlugins/plugin/sw/index'
const port = 5000
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
    port,
    proxy: {
      '/blog': {
        target: `http://localhost:${port}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/blog/, '')
        // configure (proxy) {
        //   const fn = proxy.web.bind(proxy)
        //   proxy.web = (req, res, ...args) => {
        //     if (/\.js$/.test(req.url)) {
        //       setTimeout(() => {
        //         fn(req, res, ...args)
        //       }, 500)
        //     } else {
        //       fn(req, res, ...args)
        //     }
        //   }
        // }
      }
    }
  },
  plugins: [
    vue(),
    JSX(),
    plugin(),
    swPlugin({ includes: ['index.html'] })
  ]
})
