const CONFIG = require('../common/config')
const { RouteManager } = require('../common')
const { typePlugin, updateTimePlugin } = require('../common/routerPlugin')
const MarkdownMiddleware = require('../markdown')

const routeManager = new RouteManager(CONFIG.target, CONFIG.base)

routeManager.use(new MarkdownMiddleware(CONFIG.md.dir))

routeManager.routerUse(typePlugin({
  config: CONFIG.typeMap
}))
routeManager.routerUse(updateTimePlugin())

module.exports = function plugin () {
  return {
    name: 'rollup-plugin-hz',
    buildStart () {
      return routeManager.initRouters(this.meta.watchMode)
    },
    load (id) {
      return routeManager.load(id)
    }
  }
}
