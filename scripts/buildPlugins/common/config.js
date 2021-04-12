const path = require('path')
const BASE = path.resolve(__dirname, '../../../src')
const TYPE = 'type'

module.exports = {
  base: BASE,
  target: path.join(BASE, './router/config.ts'),
  md: {
    dir: path.join(BASE, './blogs'),
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
