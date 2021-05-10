const { MiddleWare } = require('../common')
const resolveMd = require('./markdown')
const pluginHOC = require('./plugin')
const { addEnhancer, fenceEnhancerHoc } = require('./plugin/fenceEnhancer')
const { sandboxEnhancer } = require('./plugin/fenceEnhancer/sandbox')
const { mindMapEnhancer } = require('./plugin/fenceEnhancer/mindmap')
const linkPluginHOC = require('./plugin/link')
const { vueWrapperRender } = require('./renderPlugin')

addEnhancer(sandboxEnhancer)
addEnhancer(mindMapEnhancer)

const loadMd = resolveMd({
  plugins: [
    pluginHOC,
    fenceEnhancerHoc,
    linkPluginHOC
  ]
})

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
