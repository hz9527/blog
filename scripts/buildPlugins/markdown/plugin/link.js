const path = require('path')

function getHref (token) {
  const linkEntity = token.attrs[token.attrIndex('href')]
  return linkEntity ? linkEntity[1] : ''
}

function resolveLink (link, file, Token, dir) {
  if (/^(\.\/|\.\.\/)/.test(link)) {
    const token = new Token()
    const [base, hash] = link.split('#')
    const p = path.relative(dir, path.resolve(path.dirname(file), base))
    token.attrSet('href', hash ? `${p}#${hash}` : p)
    return token
  }
}

function resolveLinkHoc (router, file) {
  return (md) => {
    md.renderer.rules.inner_link = (tokens, ind) => {
      const token = tokens[ind]
      const href = getHref(token)
      return `<InnerLink href="${href}" content="${token.content}"/>`
    }
    md.core.ruler.after('inline', 'inner_link', (state) => {
      const Token = state.Token.bind(state, 'inner_link', 'a', -1)
      state.tokens.forEach((item) => {
        if (item.type === 'inline' && item.children) {
          let link = null
          item.children = item.children.reduce((res, token) => {
            const type = token.type
            if (type === 'link_open') {
              const href = getHref(token)
              if (href) {
                link = resolveLink(href, file, Token, router.baseDir)
                link && res.push(link)
              }
            }
            if (link) {
              if (type === 'link_close') {
                link = null
              } else if (type === 'text') {
                link.content += token.content
              }
            } else {
              res.push(token)
            }
            return res
          }, [])
        }
      })
    })
  }
}

module.exports = function linkPlugin (router, file) {
  const fn = resolveLinkHoc(router, file)
  return (md) => {
    fn(md)
  }
}
