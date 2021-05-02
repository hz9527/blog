function matchFactory (str) {
  const reg = new RegExp(`^//\\s+(lang=)?${str}(\\s+)?$`)
  return (line) => reg.test(line.toLowerCase()) ? str : false
}
function transform (str) {
  return str
}
const Plugins = [
  {
    match: matchFactory('html'),
    transform
  },
  {
    match: matchFactory('css'),
    transform
  },
  {
    match: matchFactory('js'),
    transform
  }
]

exports.use = function (plugin) {
  Plugins.push(plugin)
}

function resolveCode (str, plugins) { // {match, transform}[]
  // lang=xx/xx
  const list = str.split('\n')
  const result = { js: '', css: '', html: '' }
  let cur = null // {type, handler}
  for (let i = 0, l = list.length; i < l; i++) {
    const line = list[i]
    if (line.indexOf('// ') === 0) {
      for (let j = 0, len = plugins.length; j < len; j++) {
        const plugin = plugins[j]
        const type = plugin.match(line)
        // eslint-disable-next-line no-prototype-builtins
        if (result.hasOwnProperty(type)) {
          if (cur) {
            result[cur.type] = cur.handler(result[cur.type])
          }
          cur = {
            type,
            handler: plugin.transform
          }
          break
        }
      }
    } else if (cur) {
      result[cur.type] += line
    }
  }
  return result
}

module.exports.sandboxPlugin = function sandboxPlugin (md) {
  const render = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = function (tokens, ind, ...args) {
    const token = tokens[ind]
    if (token.info === 'sandbox') {
      const result = resolveCode(token.content, Plugins)
      return `<Sandbox
        js=${JSON.stringify(result.js)}
        css=${JSON.stringify(result.css)}
        html=${JSON.stringify(result.html)}
      />`
    }
    return render(tokens, ind, ...args)
  }
}