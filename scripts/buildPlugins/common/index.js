const fs = require('fs')
const path = require('path')
const { matchFactory, walkDir, getBaseInfo, EmptyRouterPlugin } = require('./utils')

class MiddleWare {
  constructor ({
    match,
    dir,
    ignore = () => false
  } = {}) {
    this.match = matchFactory(match)
    this.dir = dir
    this.ignore = ignore
    this.routers = new Set()
  }

  runLoad (...args) {
    if (this.match(...args)) {
      return this.load(...args)
    }
  }

  load () {
    throw new Error('load is super')
  }

  watch (handler) {
    fs.watch(this.dir, { recursive: true }, (event) => {
      event === 'rename' && handler()
    })
  }

  runGenRouters (routers) {
    return walkDir(this.dir, this.ignore).then(files => {
      for (const file of this.routers) {
        if (!files.includes(file)) {
          routers.delete(file)
          this.routers.delete(file)
        }
      }
      files.forEach(file => {
        if (!this.routers.has(file)) {
          routers.create(file)
          this.routers.add(file)
        }
      })
    })
  }
}

class Routers {
  constructor (baseDir) {
    this.baseDir = baseDir
    this.infos = new Map()
    this.plugins = [] // {init, create, merge, update, remove} | (info, file) => info
  }

  init (list) {
    this.infos.clear()
    list.forEach(item => {
      const file = path.join(this.baseDir, item.file)
      fs.existsSync(file) && this.infos.set(file, item)
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
    return Array.from(this.infos.values())
  }
}

class RouteManager {
  constructor (target, baseDir) {
    this.target = target
    this.middleWares = []
    this.routers = new Routers(baseDir)
    this.prefix = 'export default '
    this.task = null
    this.updateTarget = this._updateTarget.bind(this)
  }

  routerUse (plugin) {
    this.routers.use(plugin)
  }

  use (middleWares) {
    this.middleWares.push(middleWares)
  }

  load (...args) {
    for (let i = 0, l = this.middleWares.length; i < l; i++) {
      const res = this.middleWares[i].runLoad(...args, this.routers, this.updateTarget)
      if (res) {
        return res
      }
    }
  }

  _updateRoutes (middleWares) {
    const list = middleWares || this.middleWares
    return Promise.all(
      list.map(m => m.runGenRouters(this.routers))
    ).then(() => {
      this._updateTarget()
    })
  }

  initRouters (watch) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.target, (err, fd) => {
        if (err) {
          reject(err)
          return
        }
        this.routers.init(JSON.parse(fd.toString().replace(this.prefix, '')))
        this._updateRoutes().then(resolve, reject)
      })
    }).then(() => {
      if (!watch) {
        return
      }
      this.middleWares.forEach(m => m.watch(() => {
        this._updateRoutes([m])
      }))
    })
  }

  _updateTarget () {
    return Promise.resolve(this.task)
      .then(() => {
        this.task = new Promise((resolve, reject) => {
          fs.writeFile(
            this.target,
            `${this.prefix}${JSON.stringify(this.routers.toList())}`,
            e => e ? reject(e) : resolve()
          )
        }).finally(() => {
          this.task = null
        })
      })
  }
}

module.exports = {
  MiddleWare,
  RouteManager
}
