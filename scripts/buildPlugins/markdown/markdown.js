const fs = require('fs')
const markdownIt = require('markdown-it')
const hljs = require('highlight.js')

module.exports = function resolveMd (config) {
  return (id, router, update) => {
    const md = markdownIt({
      html: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch {}
        }

        return ''
      }
    })
    Array.isArray(config && config.plugins) &&
    config.plugins.length &&
    config.plugins.forEach(plugin => {
      md.use(plugin(router, id))
    })
    return new Promise((resolve, reject) => {
      fs.readFile(id, (err, fd) => {
        err ? reject(err) : resolve(fd.toString())
      })
    })
      .then(content => md.render(content))
      .then(text => update().then(() => text))
  }
}
