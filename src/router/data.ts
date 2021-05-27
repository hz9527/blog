import { RouteItem, RouterData } from '../types/index'

// show 为 false 或者无 title 会被忽略
function walk (data: RouterData, dirs: string[] = []): RouteItem[] {
  const result: RouteItem[] = []
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.children) {
      result.push(...walk(
        item.children as any,
        dirs.concat(item.title)
      ))
    } else {
      //! effect for tree
      if (!item.title || (item as any).show === false) {
        data.splice(i--, 1)
      } else {
        result.push({
          ...item,
          dirs
        } as any as RouteItem)
      }
    }
  }
  return result as RouteItem[]
}

export let RoutesConfig: RouteItem[] = []

export let Tree: RouterData = []

export function init (config: RouterData) {
  RoutesConfig = walk(config)
  Tree = config
}
