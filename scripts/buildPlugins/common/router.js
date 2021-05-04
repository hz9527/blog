
const fs = require('fs')
const path = require('path')
const { getBaseInfo, EmptyRouterPlugin, resolveDirNames } = require('./utils')

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
      item.children = handler(list) || list
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

class Routers {
  constructor (baseDir, dirnames) {
    this.baseDir = baseDir
    this.infos = new Map()
    this.getDirNames = resolveDirNames(dirnames, baseDir)
    this.plugins = [] // {init, create, merge, update, remove, format, parse} | (info, file) => info
    this.context = null
  }

  init (list, context) {
    this.context = context
    this.infos.clear()
    const infos = parse(list)
    infos.forEach(item => {
      const file = path.join(this.baseDir, item.file)
      if (fs.existsSync(file)) {
        this.infos.set(file, item)
        this.context.addWatchFile(file)
      }
    })
    this._callHook('init', null)
  }

  use (plugin) {
    this.plugins.push({
      ...EmptyRouterPlugin,
      ...(typeof plugin === 'function' ? { merge: plugin, update: plugin } : plugin)
    })
  }

  _callHook (hook, data, ...args) {
    return this.plugins.reduce((res, plugin) => {
      return plugin[hook](res, ...args, this) || res
    }, data)
  }

  create (file) {
    if (this.infos.has(file)) {
      return
    }
    this.context.addWatchFile(file)
    this.infos.set(
      file,
      this._callHook('create', getBaseInfo(file, this.baseDir), file)
    )
  }

  merge (file, info) {
    const base = this.infos.get(file)
    const value = typeof info === 'function' ? info(base) : info
    this.infos.set(
      file,
      this._callHook('merge', {
        ...base,
        ...value
      }, file)
    )
  }

  update (file, info) {
    this.infos.set(
      file,
      this._callHook('merge', {
        ...getBaseInfo(file, this.baseDir),
        ...info
      }, file)
    )
  }

  remove (file) {
    this.infos.delete(file)
    this._callHook('delete', null, file)
  }

  toList () {
    return format(
      Array.from(this.infos.values()),
      dir => this.getDirNames(path.join(this.baseDir, dir))[0] || path.basename(dir)
    )
  }
}

module.exports = Routers
