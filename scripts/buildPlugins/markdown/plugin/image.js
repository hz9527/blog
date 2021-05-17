const DATA_SET = 'preview'

function resolveStyle (obj) {
  return Object.keys(obj).map(
    (key) => `${key.replace(/[A-Z]/g, v => `-${v.toLocaleLowerCase()}`)}:${obj[key]}`
  ).join(';')
}
/**
 *
 * @param {string} alt // alt style
 * @returns
 */
function enhancerProps (alt) {
  const result = { alt, 'data-type': DATA_SET }
  const match = alt.match(/\{.+\}/)
  if (match) {
    try {
      result.alt = result.alt.replace(match[0], '').trim()
      const obj = JSON.parse(match[0])
      if (obj.class) { // {class: string; style?: string}
        return { ...result, ...obj }
      } else {
        return { ...result, style: resolveStyle(obj) }
      }
    } catch {}
  }
  return result
}

function getAttr (token, attr) {
  return token.attrs[token.attrIndex(attr)]
}

module.exports.imgPluginHoc = (route, file) => {
  return (md) => {
    const render = md.renderer.rules.image.bind(md.renderer.rules)
    md.renderer.rules.image = function (tokens, ind, ...args) {
      const img = tokens[ind]
      const url = getAttr(img, 'src')
      if (!url) {
        return render(tokens, ind, ...args)
      }
      let alt = getAttr(img, 'alt')
      alt = (alt && alt[1]) || img.content
      const props = alt ? enhancerProps(alt) : {}
      return `<img src=${url[1]} ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')} />`
    }
  }
}
