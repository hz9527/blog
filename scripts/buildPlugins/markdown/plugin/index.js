const config = require('../../common/config')
const { wrapperRender, getText, matchFactory, renderTitle, handlerValue } = require('./utils')

const CONFIG = config.md
const Matches = CONFIG.keys.map(matchFactory)

function resolveHeadHOC (router, file) {
  return (md) => {
    router.merge(file, { headers: [] })
    wrapperRender(md, 'renderToken', (tokens, ind) => {
      const token = tokens[ind]
      if (token.type !== 'heading_open') {
        return
      }
      let index = ind + 1
      let cur = tokens[index]
      const list = []
      while (cur && cur.type !== 'heading_close') {
        list.push(cur)
        cur = tokens[++index]
      }
      const title = getText(list)
      const level = parseInt(token.tag.slice(1))
      if (!isNaN(level)) {
        router.merge(file, (info) => {
          if (level === 1) {
            return { title }
          } else {
            return { headers: [...info.headers, { level, title }] }
          }
        })
      }
      token.attrSet('name', encodeURIComponent(title))
    })
  }
}

function resolveKeysHOC (router, file) {
  return (md) => {
    const InfoData = CONFIG.keys.map(() => [])
    router.merge(file, {
      tips: InfoData[0],
      types: InfoData[1]
    })
    wrapperRender(md, 'renderInline', (tokens) => {
      let ind = -1
      const list = []
      for (let i = 0, l = tokens.length; i < l; i++) {
        const token = tokens[i]
        if (token.type === 'html_inline') {
          if (ind !== -1) { // todo
            if (list.length) {
              InfoData[ind].push(getText(list))
              list.length = 0
            }
            ind = -1
          } else {
            ind = Matches.findIndex(reg => reg.test(token.content))
          }
        } else if (~ind) {
          !!token.content && list.push(token)
        }
      }
      console.log('info', InfoData)
    })
    const matches = Matches.map((reg, i) => ({ reg, key: CONFIG.keys[i] })).concat([{
      reg: matchFactory(CONFIG.updateClass),
      key: CONFIG.updateClass
    }])
    md.renderer.rules.pre_fix = function (tokens, ind) {
      console.log('prefix', 5555)
      const token = tokens[ind]
      let base = renderTitle(token.tag)
      if (matches.length) {
        base = matches.map(item => {
          const ind = CONFIG.keys.indexOf(item.key)
          const value = handlerValue(item.key, router)
          if (ind === -1) {
            router.merge(file, {
              updateTime: value
            })
          } else {
            InfoData[ind].push(value)
          }
          return `${renderTitle(item.key)}<b class="${item.key}">${value}</b>`
        }).join('') + base
        matches.length = 0
      }
      return base
    }
    md.inline.ruler.before('html_inline', 'pre_fix', (state, ...args) => {
      if (matches.length) {
        for (let i = 0, l = state.tokens.length; i < l; i++) {
          const token = state.tokens[i]
          if (token.type === 'html_inline') {
            const ind = matches.findIndex(item => item.reg.test(token.content))
            if (~ind) {
              state.tokens.splice(i, 0, new state.Token('pre_fix', matches[ind].key, 0))
              matches.splice(ind, 1)
              return true
            }
          }
        }
      }
    })
  }
}

module.exports = function pluginHOC (router, file) {
  const resolveHead = resolveHeadHOC(router, file)
  const resolveKeys = resolveKeysHOC(router, file)
  return (md) => {
    resolveHead(md)
    resolveKeys(md)
  }
}
