const fs = require('fs')

function typePlugin ({
  ignore = () => false
} = {}) {
  return function handler (info, file, context) {
    if (ignore(file)) {
      return info
    }
    const names = context.getDirNames(file)
    if (names.length === 0) {
      return info
    }
    names.forEach(t => !info.types.includes(t) && info.types.push(t))
    return info
  }
}

function getTime (file) {
  const info = fs.statSync(file)
  return {
    mtime: Math.floor(info.mtimeMs),
    birthTime: Math.floor(info.birthtimeMs)
  }
}

function hasModify (time, base) {
  return time.mtime - time.birthTime > 100 && time.mtime > base
}

/**
 * 如果是clone或者checkout过来，创建时间和修改时间小于 100ms
 * 如果是没dev期间修改文件，birthtimeMs - mtimeMs > 100ms && mtime > updateTime
**/
function updateTimePlugin () {
  const timeMap = new Map() // Map<string, number>
  function handler (info, file) {
    const time = getTime(file)
    let value = timeMap.get(file)
    if (!value) {
      value = time.mtime
      timeMap.set(file, value)
    } else if (hasModify(time, value)) {
      value = time.mtime
    }
    info.updateTime = value
    return info
  }
  return {
    init (_, context) {
      for (const key of context.infos.keys()) {
        const info = context.infos.get(key)
        const time = getTime(key)
        if (hasModify(time, info.updateTime)) {
          info.updateTime = time.mtime
        }
        timeMap.set(key, info.updateTime)
      }
    },
    update: handler,
    merge: handler
  }
}

module.exports = {
  typePlugin,
  updateTimePlugin
}
