const path = require('path')
const CONFIG = require('../common/config')
const { RouteManager } = require('../common')
const { typePlugin, updateTimePlugin } = require('../common/routerPlugin')
const MarkdownMiddleware = require('../markdown')
const dynamicHandler = require('./dynamicImport')

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
      return routeManager.initRouters(this.meta.watchMode, this)
    },
    transform (code, id) { // dynamicImports
      if (CONFIG.dynamicFile.includes(id)) {
        return dynamicHandler.call(this, code, getPaths.bind(null, id))
      }
    },
    load (id) {
      return routeManager.load(id)
    }
  }
}
