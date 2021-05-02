import { RoutesConfig as data } from '../../router/data'
import { Headline, Tree } from '../../types/index'

function transTree (list: Headline[]): Tree<Headline> {
  const infos: Tree<Headline> = list.map(item => ({ ...item, children: [] }))
  const stack: Tree<Headline> = []
  const result: Tree<Headline> = []
  let p = 0
  while (p < infos.length) {
    const top = stack[stack.length - 1]
    if (!top) {
      stack.push(infos[p])
      result.push(infos[p++])
    } else if (infos[p].level > top.level) {
      top.children.push(infos[p])
      stack.push(infos[p++])
    } else {
      stack.pop()
    }
  }
  return result
}

let Cache: {path: string; data: Tree<Headline>}[]

function init () {
  Cache = data.map(item => ({
    path: item.hash,
    data: transTree(item.headlines)
  }))
}

export default function getTree (path: string): Tree<Headline> {
  if (!Cache) {
    init()
  }
  const res = Cache.find(item => path.includes(item.path))
  return res ? res.data : []
}
