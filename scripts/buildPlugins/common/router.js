
const fs = require('fs')
const path = require('path')
const { getBaseInfo, EmptyRouterPlugin, resolveFactory } = require('./utils')
const { parse, format } = require('./routerHelp')

class Routers {
  constructor (baseDir, dirnames) {
    this.baseDir = baseDir
    this.infos = new Map()
    const { resolveDirNames, sort } = resolveFactory(dirnames, baseDir)
    this.getDirNames = resolveDirNames
    this.sort = sort
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
      dir => this.getDirNames(path.join(this.baseDir, dir))[0] || path.basename(dir),
      this.sort
    )
  }
}

module.exports = Routers
