const { MiddleWare } = require('../common')
const resolveMd = require('./markdown')
const pluginHOC = require('./plugin')
const { sandboxPlugin } = require('./plugin/sandbox')
const { vueWrapperRender } = require('./renderPlugin')

const loadMd = resolveMd({ plugins: [pluginHOC, () => sandboxPlugin] })

module.exports = class MdMiddleWare extends MiddleWare {
  constructor (dir) {
    super({
      match: /\.md$/,
      dir
    })
  }

  load (id, routers, update) {
    return loadMd(id, routers, update).then(text => vueWrapperRender(text, id))
  }
}
