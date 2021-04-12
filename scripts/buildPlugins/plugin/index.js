const CONFIG = require('../common/config')
const { RouteManager } = require('../common')
const MarkdownMiddleware = require('../markdown')

const routeManager = new RouteManager(CONFIG.target, CONFIG.base)

routeManager.use(new MarkdownMiddleware(CONFIG.md.dir))

module.exports = function plugin () {
  return {
    name: 'rollup-plugin-hz',
    buildStart () {
      return routeManager.initRouters()
    },
    load (id) {
      return routeManager.load(id)
    }
  }
}
