const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { DIR_KEY } = require('./meta')

function createContext (context, watch) {
  let addWatchFile
  if (watch) {
    addWatchFile = context.addWatchFile.bind(context)
  } else {
    addWatchFile = noop
  }
  return {
    addWatchFile
  }
}

function matchFactory (match) {
  if (typeof match === 'function') {
    return match
  } else if (match instanceof RegExp) {
    return (id) => match.test(id)
  } else if (typeof match === 'string') {
    return id => id === match
  } else {
    throw new Error(`${match} is invalid`)
  }
}

function walkDir (dir, ignore = () => false) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, list) => {
      if (err) {
        reject(err)
      }
      const { files, dirs } = list.reduce((res, name) => {
        const item = path.join(dir, name)
        if (ignore(item)) {
          return res
        }
        fs.statSync(item).isDirectory() ? res.dirs.push(item) : path.extname(item) && res.files.push(item)
        return res
      }, { files: [], dirs: [] })
      if (dirs.length) {
        return Promise.all(dirs.map(d => walkDir(d, ignore))).then((list) => {
          resolve(list.reduce((res, l) => res.concat(l), files))
        }, reject)
      } else {
        resolve(files)
      }
    })
  })
}

const KEYS = Array.from('ABCDEFGHIJ')
function createHash (text, len = 20) {
  return crypto
    .createHash('md5')
    .update(text)
    .digest('hex')
    .slice(0, len)
    .replace(/\d/g, d => KEYS[d])
}

function getBaseInfo (file, dir) {
  const base = path.relative(dir, file)
  return {
    file: base,
    title: '',
    hash: createHash(base),
    updateTime: Date.now(),
    headlines: [], // {level, value}
    tips: [],
    types: [],
    show: true
  }
}

const noop = () => {}

const EmptyRouterPlugin = {
  init: noop,
  create: noop,
  merge: noop,
  update: noop,
  remove: noop
}

function getDirInfo (obj, keys = []) {
  const result = [[], []]
  const base = path.join(...keys)
  if (obj[DIR_KEY] && typeof obj[DIR_KEY] === 'string') {
    result[0].push(base)
    result[1].push([obj[DIR_KEY]])
  }
  return Object.keys(obj).reduce((res, key) => {
    const value = obj[key]
    if (Array.isArray(value)) {
      res[0].push(path.join(base, key))
      res[1].push(value)
    } else if (value && typeof value === 'object') {
      const [ps, ns] = getDirInfo(value, keys.slice().concat([key]))
      res[0].push(...ps)
      res[1].push(...ns)
    } else if (value) {
      res[0].push(path.join(base, key))
      res[1].push([value])
    }
    return res
  }, result)
}

const resolveFactory = (config, baseDir) => {
  let [paths, names] = getDirInfo(config)
  const dirs = paths
  paths = paths.map(i => path.join(baseDir, i))
  return {
    resolveDirNames: (file) => {
      const dir = fs.statSync(file).isDirectory() ? file : path.dirname(file)
      const ind = paths.findIndex(p => dir === p)
      return ~ind ? names[ind] : []
    },
    sort: (list) => {
      if (list.length < 2) {
        return list
      }
      const { dirData, fileData } = list.reduce((res, item) => {
        item[DIR_KEY] ? res.dirData.push(item) : res.fileData.push(item)
        return res
      }, { dirData: [], fileData: [] })
      return dirData.sort((a, b) => dirs.indexOf(a[DIR_KEY]) - dirs.indexOf(b[DIR_KEY])).concat(fileData)
    }
  }
}

module.exports = {
  createContext,
  matchFactory,
  walkDir,
  createHash,
  getBaseInfo,
  EmptyRouterPlugin,
  resolveFactory
}
