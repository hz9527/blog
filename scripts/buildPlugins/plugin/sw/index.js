const path = require('path')
const fs = require('fs')

const getTemplate = (() => {
  let template
  return () => {
    if (!template) {
      template = fs.readFileSync(path.resolve(__dirname, './template.js')).toString()
    }
    return template
  }
})()

function genSW (assets = [], asset = '""') {
  return getTemplate()
    .replace('const FILES = []', `const FILES = [${assets.join(',')}]`)
    .replace('const ASSETS = \'\'', `const ASSETS = ${asset}`)
}
// todo 暂时不支持多页定制
const FileName = 'sw.js'
module.exports = function plugin ({ includes } = {}) {
  let base = '/'
  let asset = ''
  return {
    name: 'rollup-plugin-serviceWorker',
    configureServer (server) {
      server.app.use(`/${FileName}`, (_, res) => {
        res.setHeader('content-type', 'application/javascript')
        res.end(genSW())
      })
    },
    configResolved (conf) {
      base = conf.base || base
      asset = conf.build.asset || asset
    },
    transformIndexHtml (html, ctx) {
      if (includes.some(i => ctx.filename.includes(i))) {
        return html.replace(
          '</body>',
          `<script>if("serviceWorker" in navigator){navigator.serviceWorker.register("${base}${FileName}")}</script></body>`
        )
      }
    },
    generateBundle (conf, output) {
      const assets = Object.keys(output)
      this.emitFile({
        type: 'asset',
        fileName: FileName,
        source: genSW(assets.map(i => JSON.stringify(base + i)), JSON.stringify(asset))
      })
    }
  }
}
