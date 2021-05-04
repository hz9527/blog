let id = 0

module.exports = function (code, getFiles) {
  const name = `__varDynamicImport${++id}`
  code = code.replace('import(', `${name}(`)
  code += `function ${name}(p) {` + '\n  switch(p) {\n' +
  getFiles().map(file => `    case '${file}' : return import('${file}')`).join('\n') +
  '\n }\n}'
  return Promise.resolve(code)
}
