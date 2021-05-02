import { RoutesConfig } from '../../router/data'
import { RouteItem } from '../../types'

export type Item = {
  hl: boolean; value: string
}[]

interface Data {
  className: string;
  title: string;
  match: Item;
}

export interface ResultItem {
  title: Item;
  path: string;
  data: Data[]
}

const SearchConf: {
  key: keyof RouteItem;
  weight: number;
  title: string;
}[] = [ // todo 和服务端配置联动
  { key: 'title', weight: 30, title: '' },
  { key: 'tips', weight: 20, title: '关键词' },
  { key: 'types', weight: 10, title: '文章类型' },
  { key: 'headlines', weight: 15, title: '' }
]

function getItem (key: string, data: string): Item | null {
  const list = data.split(key)
  if (list.length === 1) {
    return null
  }
  return list.reduce((res, str, i) => {
    str && res.push({ hl: false, value: str })
    if (i < list.length) {
      res.push({ hl: true, value: key })
    }
    return res
  }, [] as Item)
}

function resolveData <K extends keyof RouteItem> (
  key: string,
  data: RouteItem[K],
  name: K
): Item | null {
  if (typeof data === 'string') {
    return getItem(key, data)
  }
  if (Array.isArray(data)) {
    const res = data.reduce((res: Item, item: any) => {
      const list = name === 'headlines' ? getItem(key, item.name) : getItem(key, item)
      if (list) {
        const base = res.length ? res.concat([{ hl: false, value: '' }]) : res
        return base.concat(list)
      }
      return res
    }, [] as Item)
    return res.length ? res : null
  }
  return null
}

export function search (value: string): ResultItem[] {
  if (!value) {
    return []
  }
  const list: (ResultItem & {weight: number})[] = []
  RoutesConfig.forEach(item => {
    const result: (typeof list)[number] = {
      title: [],
      path: item.hash,
      data: [],
      weight: 0
    }
    for (let i = 0, l = SearchConf.length; i < l; i++) {
      const { key, weight, title } = SearchConf[i]
      const data = item[key]
      const res = resolveData(value, data, key)
      if (res) {
        result.weight += weight
        if (key === 'title') {
          result.title = res
        } else {
          result.data.push({
            title,
            className: `search-result-${key}`,
            match: res // 多项中间有空字符串
          })
        }
      }
    }
    if (result.weight > 0) {
      if (result.title.length === 0) {
        result.title = [{ hl: false, value: item.title }]
      }
      list.push(result)
    }
  })
  return list.sort((a, b) => b.weight - a.weight).map(item => {
    const { weight, ...rest } = item
    return rest
  })
}
