const path = require('path')
const { DIR_KEY } = require('./meta')
function parse (list) {
  const result = []
  for (let i = 0, l = list.length; i < l; i++) {
    const item = list[i]
    if (item.file) {
      result.push(item)
    } else {
      result.push(...parse(item.children))
    }
  }
  return result
}

function createDir (dir, getTitle) {
  return {
    title: getTitle(dir),
    [DIR_KEY]: dir, // json will ignore
    children: []
  }
}

function isRoot (dir) {
  // todo
  return dir === path.basename(dir)
}

function walk (list, handler) {
  for (let i = 0, l = list.length; i < l; i++) {
    const item = list[i]
    if (item.children) {
      item.children = handler(item.children) || item.children
      walk(item.children, handler)
    }
  }
}

function format (list, getTitle, sort) {
  const dirMap = new Map()
  const res = []
  function initDir (dir) {
    const dirObj = createDir(dir, getTitle)
    let tem = dirObj
    let temDir = dir
    while (!dirMap.has(temDir)) {
      dirMap.set(temDir, tem)
      if (isRoot(temDir)) {
        res.push(tem)
        break
      }
      const pDir = path.dirname(temDir)
      const parent = dirMap.get(pDir) || createDir(pDir, getTitle)
      parent.children.push(tem)
      tem = parent
      temDir = pDir
    }
    return dirObj
  }
  list
    .sort((a, b) => a.file - b.file)
    .reduce((res, item) => {
      const dir = path.dirname(item.file)
      let dirObj = dirMap.get(dir)
      if (!dirObj) {
        dirObj = initDir(dir)
      }
      dirObj.children.push(item)
      return res
    }, res)
  if (typeof sort === 'function') {
    const result = sort(res) || res
    walk(result, sort)
    return result
  }
  return res
}

module.exports = {
  parse,
  format
}
