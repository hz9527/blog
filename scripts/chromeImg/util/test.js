const path = require('path')
const fs = require('fs')
const parser = require('./parser')
const xml = fs
  .readFileSync(path.resolve(__dirname, '../Images/src/largeIcons.svg'))
  .toString()
const result = parser(xml)

// const i = 0
result[1].children = result[1].children.filter((item, i) => {
  console.log(item)
  return i % 2 && i % 3
})

fs.writeFile(
  path.resolve(__dirname, '../Images/test.svg'),
  result.map(n => n.toString()).join(''),
  console.log
)

fs.writeFile(
  path.resolve(__dirname, '../Images/test2.svg'),
  xml.replace(/\n/g, '').replace(/\s+/g, ' '),
  console.log
)
