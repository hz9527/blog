const path = require('path')
const { MiddleWare } = require('../common')
const resolveMd = require('./markdown')
const pluginHOC = require('./plugin')
const { addEnhancer, fenceEnhancerHoc } = require('./plugin/fenceEnhancer')
const { sandboxEnhancer, use } = require('./plugin/fenceEnhancer/sandbox')
const { mindMapEnhancer } = require('./plugin/fenceEnhancer/mindmap')
const { imgPluginHoc } = require('./plugin/image')
const linkPluginHOC = require('./plugin/link')
const { vueWrapperRender } = require('./renderPlugin')
const { resolveInclude } = require('./plugin/utils')

use((factory) => {
  const reg = factory('includejs')
  return {
    match (line) {
      return reg.test(line) ? 'js' : false
    },
    transform (str, file) {
      return resolveInclude(str, file)
    }
  }
})

addEnhancer(sandboxEnhancer)
addEnhancer(mindMapEnhancer)

const loadMd = resolveMd({
  plugins: [
    pluginHOC,
    fenceEnhancerHoc,
    linkPluginHOC,
    imgPluginHoc
  ]
})

module.exports = class MdMiddleWare extends MiddleWare {
  constructor (dir) {
    super({
      match: /\.md$/,
      dir,
      ignore (p) {
        if (path.extname(p)) {
          return !/\.md$/.test(p)
        }
        return false
      }
    })
  }

  load (id, routers, update) {
    return loadMd(id, routers, update).then(text => vueWrapperRender(text, id))
  }
}
