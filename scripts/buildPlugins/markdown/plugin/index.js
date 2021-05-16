const config = require('../../common/config')
const { wrapperRender, getText, matchFactory, renderTitle, handlerValue, getContents, genIdFactory } = require('./utils')

const CONFIG = config.md
const Keys = CONFIG.keys.concat([CONFIG.hideClass])
const Matches = Keys.map(matchFactory) // b 标签 className
function resolveHeadHOC (router, file) {
  return (md) => {
    router.merge(file, { headlines: [] })
    const getId = genIdFactory()
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
      const id = getId(title)
      const level = parseInt(token.tag.slice(1))
      if (!isNaN(level)) {
        router.merge(file, (info) => {
          if (level === 1) {
            return { title }
          } else {
            return { headlines: [...info.headlines, { level, name: title, value: id }] }
          }
        })
      }
      token.attrSet('id', id)
    })
  }
}

function resolveShow (list) {
  const shouldHide = getContents(list).some(item => item.trim() !== 'false')
  return !shouldHide
}

function resolveKeysHOC (router, file) {
  return (md) => {
    const InfoData = CONFIG.keys.map(() => [])
    router.merge(file, {
      tips: InfoData[0],
      types: InfoData[1]
    })
    const route = router.infos.get(file)
    wrapperRender(md, 'renderInline', (tokens) => {
      let ind = -1
      let isHide = false
      const list = []
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token.type === 'html_inline') {
          if (ind !== -1) { // todo
            if (list.length) {
              if (!isHide) {
                InfoData[ind].push(getText(list))
              } else {
                router.merge(file, {
                  show: resolveShow(list, route)
                })
              }
              list.length = 0
            }
            ind = -1
          } else {
            ind = Matches.findIndex(reg => reg.test(token.content))
            isHide = !(ind < InfoData.length)
          }
        } else if (~ind) {
          if (isHide) {
            list.push(token)
            tokens.splice(i--, 1)
          } else {
            !!token.content && list.push(token)
          }
        }
      }
    })
    // 需要匹配的基本信息
    const matches = Matches.map((reg, i) => ({ reg, key: CONFIG.keys[i] })).concat([{
      reg: matchFactory(CONFIG.updateClass),
      key: CONFIG.updateClass
    }])
    md.renderer.rules.pre_fix = function (tokens, ind) {
      const token = tokens[ind]
      let base = renderTitle(token.tag)
      if (matches.length) {
        base = matches.map(item => {
          if (!item.key) {
            return ''
          }
          const value = handlerValue(item.key, route)
          return `${renderTitle(item.key)}${value.map(v => `<b class="${item.key}">${v}</b>`)}`
        }).join('') + base
        matches.length = 0
      }
      return base
    }
    md.inline.ruler.before('html_inline', 'pre_fix', (state) => {
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
