const fs = require('fs')
const path = require('path')
const Config = require('../common/config')
class FileManager {
  constructor (baseDir, limit = 10000) {
    this.baseDir = baseDir
    this.limit = limit
    this.files = new Map() // file chunk
    this.chunks = [] // {name, files: {file, size}[], size}
  }

  getNs (i) {
    return `ns_${i}`
  }

  pushChunk (filePath) { // ! 目前写得比较粗糙，没有尝试打包体积，而是直接根据源文件大小来限制
    let chunk = this.chunks[0]
    const size = fs.statSync(filePath).size
    if (!chunk || chunk.size + size > this.limit) {
      chunk = {
        path: path.resolve(this.baseDir, `./${this.chunks.length}.js`),
        files: [],
        size: 0
      }
      this.chunks.unshift(chunk)
    }
    chunk.files.push({ file: filePath, size: size })
    chunk.size += size
    this.chunks.sort((a, b) => a.size - b.size)
    return chunk
  }

  getFile (filePath, base) {
    let chunk = this.files.get(filePath)
    if (!chunk) {
      chunk = this.pushChunk(filePath)
      this.files.set(filePath, chunk)
    }
    return {
      file: path.relative(base, chunk.path),
      namespace: this.getNs(chunk.files.findIndex(i => i.file === filePath))
    }
  }

  loadChunk (chunkPath) {
    const chunk = this.chunks.find(i => i.path === chunkPath)
    if (!chunk) {
      return
    }
    return chunk.files
      .map((item, i) => `export * as ${this.getNs(i)} from './${path.relative(this.baseDir, item.file)}'`)
      .join('\n')
  }

  getChunkPath (filePath) {
    const chunk = this.files.get(filePath)
    return chunk && chunk.path
  }
}

class Manager {
  constructor (limit = 30000) {
    this.fileManager = new FileManager(Config.base, limit)
    this.id = 0
    this.isBuild = true
  }

  init (isBuild) {
    this.isBuild = isBuild
  }

  resolver (code, getFiles, base) {
    const name = `__varDynamicImport${++this.id}`
    code = code.replace('import(', `${name}(`)
    const handler = this.isBuild
      ? (file) => {
          const dir = path.dirname(base)
          const filePath = path.resolve(dir, file)
          const res = this.fileManager.getFile(filePath, dir)
          return `    case '${file}' : return import('${res.file}').then(m => m.${res.namespace})`
        }
      : (file) => `    case '${file}' : return import('${file}')`
    code += `function ${name}(p) {` + '\n  switch(p) {\n' +
    getFiles().map(handler).join('\n') +
  '\n }\n}'
    return Promise.resolve(code)
  }

  loadId (file) {
    if (this.isBuild) {
      const res = this.fileManager.loadChunk(file)
      return res && Promise.resolve(res)
    }
  }

  resolveDynamicImport (file, base) {
    if (this.isBuild) {
      return path.resolve(path.dirname(base), file)
    }
  }
}

module.exports = new Manager()
