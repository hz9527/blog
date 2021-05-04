const fs = require('fs')
const Routers = require('./router')
const { matchFactory, walkDir, createContext } = require('./utils')
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

class RouteManager {
  constructor (target, ...args) {
    this.target = target
    this.middleWares = []
    this.routers = new Routers(...args)
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

  load (...args) { // id
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
    ).then(() => this._updateTarget())
  }

  initRouters (watch, rollupContext) {
    const context = createContext(rollupContext, watch)
    return new Promise((resolve, reject) => {
      fs.readFile(this.target, (err, fd) => {
        if (err) {
          reject(err)
          return
        }
        const str = fd.toString().replace(this.prefix, '')
        this.routers.init(str ? JSON.parse(str) : [], context)
        this._updateRoutes()
          .then(
            () =>
              Promise.all(
                Array.from(this.routers.infos.keys()).map(id => this.load(id))
              )
          )
          .then(resolve, reject)
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

  _updateTarget () { // todo 限频
    return Promise.resolve(this.task)
      .then(() => {
        this.task = new Promise((resolve, reject) => {
          const data = this.routers.toList()
          if (data) {
            fs.writeFile(
              this.target,
              `${this.prefix}${JSON.stringify(data, undefined, 2)}`,
              e => e ? reject(e) : resolve()
            )
          } else {
            resolve()
          }
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
