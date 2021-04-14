const config = require('../../common/config')

const { titleMap, titleClass, typeClass, updateClass } = config.md

function wrapperRender (md, key, handler) {
  const render = md.renderer[key].bind(md.renderer)
  md.renderer[key] = (...args) => {
    return handler(...args, render) || render(...args)
  }
}

function getText (tokens) {
  return tokens.map(t => t.content).join('')
}

function matchFactory (key) {
  return new RegExp(`^<b\\s+class\\s?=\\s?['"]\\s?${key}\\s?['"]\\s?>`)
}

function renderTitle (name) {
  return `<span class="${titleClass}">${titleMap[name]}:</span>`
}

function handlerValue (key, info) {
  if (key === typeClass) {
    return info.types
  } else if (key === updateClass) {
    return [info.updateTime]
  }
}

module.exports = {
  wrapperRender,
  getText,
  matchFactory,
  renderTitle,
  handlerValue
}
