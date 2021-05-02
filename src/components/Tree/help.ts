import { Tree } from '../../types/index'
import { ROOT_KEY } from './utils'
import { Options, Data, Extra } from './type'

function handler<D extends Record<string, any>, K extends string> (
  tree: Tree<D>,
  opt: Required<Options<D, K>>,
  pNames: string[] = []
): Data<D, K> {
  const res: Data<D, K> = []
  for (let i = 0, l = tree.length; i < l; i++) {
    const base = tree[i]
    const extra: Extra<K>[K] = {
      name: opt.getName(base),
      names: [],
      canFold: opt.getCanFold(base),
      fold: opt.getInitFold(base)
    }
    const item: Data<D, K>[number] = {
      ...base,
      [opt.key]: extra
    }
    item.children && (item.children = handler(item.children, opt, extra.names))
    extra.names.concat([extra.name]).forEach(n => {
      !pNames.includes(n) && pNames.push(n)
    })
    res.push(item)
  }
  return res
}

export default function wrapTree<D extends Record<string, any>, K extends string = typeof ROOT_KEY> (
  tree: Tree<D>,
  {
    getName,
    getCanFold = () => false,
    getInitFold = () => false,
    key = ROOT_KEY as K
  }: Options<D, K>
): {data: Data<D, K>, names: string[]} {
  const data = handler(tree, { getName, getCanFold, getInitFold, key })
  const names = Array.from(new Set(data.reduce((res, item) => {
    res.push(item[key].name)
    return res.concat(item[key].names)
  }, [] as string[])))
  return { data, names }
}
