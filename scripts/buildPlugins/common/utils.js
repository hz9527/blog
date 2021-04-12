const fs = require('fs')
const path = require('path')

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
        fs.statSync(item).isDirectory() ? res.dirs.push(item) : res.files.push(item)
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

function getBaseInfo (file, dir) {
  return {
    file: path.relative(dir, file),
    title: '',
    updateTime: Date.now(),
    headers: [], // {level, value}
    tips: [],
    types: []
  }
}

module.exports = {
  matchFactory,
  walkDir,
  getBaseInfo
}
