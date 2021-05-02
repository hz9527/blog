const config = require('../../common/config')

const { titleMap, titleClass, typeClass, updateClass } = config.md

function wrapperRender (md, key, handler) {
  const render = md.renderer[key].bind(md.renderer)
  md.renderer[key] = (...args) => {
    return handler(...args, render) || render(...args)
  }
}

function getContents (tokens) {
  return tokens.map(t => t.content)
}

function getText (tokens) {
  return getContents(tokens).join('')
}

function matchFactory (key) {
  return new RegExp(`^<b\\s+class\\s?=\\s?['"]\\s?${key}\\s?['"]\\s?>`)
}

function renderTitle (name) {
  const title = titleMap[name]
  return title ? `<span class="${titleClass}">${titleMap[name]}:</span>` : ''
}

function handlerValue (key, info) {
  if (key === typeClass) {
    return info.types
  } else if (key === updateClass) {
    return [`{{$filters.timeFormat(${info.updateTime})}}`]
  }
}

module.exports = {
  wrapperRender,
  getText,
  getContents,
  matchFactory,
  renderTitle,
  handlerValue
}
