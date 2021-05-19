const path = require('path')
const fs = require('fs')
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

function genIdFactory () {
  const titleMap = new Map()
  return title => {
    const counts = titleMap.get(title) || 0
    titleMap.set(title, counts + 1)
    return encodeURIComponent(counts ? title + counts : title)
  }
}

const BaseReg = /import\s+('.+'|".+")/g
const Reg = /import\s+('(.+)'|"(.+)")/
function getFileContent (str, baseFile) { // ! 不支持 watch
  const match = str.match(Reg)
  if (!match) {
    return str
  }
  const file = path.resolve(path.dirname(baseFile), match[2])
  if (!fs.existsSync(file)) {
    console.warn(`${file} not found`)
    return `${match[2]} is not exist`
  }
  return fs.readFileSync(file).toString()
}

function resolveInclude (content, file) {
  const match = content.match(BaseReg)
  let data = content
  if (match) {
    match.forEach(str => {
      data = data.replace(str, () => getFileContent(str, file))
    })
  }
  return data
}

module.exports = {
  wrapperRender,
  getText,
  getContents,
  matchFactory,
  renderTitle,
  handlerValue,
  genIdFactory,
  resolveInclude
}
