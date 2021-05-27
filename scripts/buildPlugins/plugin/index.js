const path = require('path')
const CONFIG = require('../common/config')
const { RouteManager } = require('../common')
const { typePlugin, updateTimePlugin } = require('../common/routerPlugin')
const MarkdownMiddleware = require('../markdown')
const manager = require('./dynamicImport')

const routeManager = new RouteManager(CONFIG.target, CONFIG.base, CONFIG.dirNameMap)

routeManager.use(new MarkdownMiddleware(CONFIG.md.dir))

routeManager.routerUse(typePlugin())
routeManager.routerUse(updateTimePlugin())

function getPaths (id) {
  const dir = path.dirname(id)
  return Array.from(routeManager.routers.infos.keys())
    .map(file => path.relative(dir, file))
}

module.exports = function plugin () {
  return {
    name: 'rollup-plugin-blog',
    configureServer (server) { // vite 托管了 rollup，watcher 暂时这样实现
      server.watcher.on('change', (file) => {
        routeManager.load(file)
      })
    },
    buildStart () {
      manager.init(process.env.NODE_ENV === 'production')
      return routeManager.initRouters(this.meta.watchMode, this)
    },
    transform (code, id) { // dynamicImports
      if (CONFIG.dynamicFile.includes(id)) {
        return manager.resolver(code, getPaths.bind(null, id), id, this)
      }
    },
    resolveDynamicImport (...args) {
      return manager.resolveDynamicImport(...args)
    },
    load (id) {
      return manager.loadId(id) || routeManager.load(id)
    },
    outputOptions (option) {
      const fn = typeof option.manualChunks === 'string' ? () => option.manualChunks : (option.manualChunks || (() => {}))
      return {
        ...option,
        // chunkFileNames (info) {
        //   return option.chunkFileNames
        // },
        manualChunks (id, ...args) {
          // todo 后续将路由生成及相关逻辑拆出来后单独拆包，保证大部分chunk hash 一致
          // 1. 经常变动部分一旦被别的模块依赖就应该不能有hash
          // 2. 将经常变动部分代码拆分成单独文件
          // 实现 contenthash & 配合 sw
          return fn(id, ...args)
        }
      }
    }
  }
}
