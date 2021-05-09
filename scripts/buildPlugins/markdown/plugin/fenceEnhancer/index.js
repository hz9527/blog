const Enhancers = []

exports.addEnhancer = function ({ match, handler }) {
  let matcher
  if (typeof match === 'function') {
    matcher = match
  } else if (typeof match === 'string' || match instanceof RegExp) {
    const reg = typeof match === 'string' ? new RegExp(match) : match
    matcher = info => reg.test(info)
  }
  matcher && Enhancers.push({ matcher, handler })
}

exports.fenceEnhancerHoc = function (router, id) {
  return md => {
    const render = md.renderer.rules.fence.bind(md.renderer.rules)
    md.renderer.rules.fence = function (tokens, ind, ...args) {
      const token = tokens[ind]
      const item = Enhancers.find(item => item.matcher(token.info))
      if (item) {
        return item.handler(token.content, id, router, () => render(tokens, ind, ...args))
      }
      return render(tokens, ind, ...args)
    }
  }
}
