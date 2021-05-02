// vue-render
const path = require('path')
const sfc = require('@vue/compiler-sfc')

exports.vueWrapperRender = function vueWrapperRender (text, file) {
  const res = sfc.compileTemplate({
    source: `<div class="page-container">${text}</div>`,
    filename: path.basename(file),
    id: file
  })
  return `${res.code};export default {render}`
}
