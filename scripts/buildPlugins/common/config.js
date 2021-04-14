const path = require('path')
const BASE = path.resolve(__dirname, '../../../src')
const TYPE = 'type'

const MD_DIR = 'blogs'
module.exports = {
  base: BASE,
  target: path.join(BASE, './router/config.ts'),
  typeMap: {
    [MD_DIR]: {
      designMode: '设计模式',
      js: 'js'
    }
  },
  md: {
    dir: path.join(BASE, `./${MD_DIR}`),
    keys: ['kw', TYPE],
    typeClass: TYPE,
    updateClass: 'updateTime',
    titleClass: 'tag-title',
    titleMap: {
      kw: '关键词',
      type: '文章类型',
      updateTime: '更新时间'
    }
  }
}
