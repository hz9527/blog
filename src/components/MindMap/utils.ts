export function getZoom (value: number, base: number): number {
  return value > base ? Math.floor(base / value * 20) * 5 : 100
}

function createTag (tagName: string, attrs: Record<string, string>): Element {
  const tag = document.createElement(tagName)
  Object.keys(attrs).forEach(key => {
    tag.setAttribute(key, attrs[key])
  })
  return tag
}
const TagList = [
  {
    tag: 'link',
    match: /\.css$/,
    getAttr (url: string) {
      return {
        rel: 'stylesheet',
        type: 'text/css',
        href: url
      }
    }
  },
  {
    tag: 'script',
    match: /\.js$/,
    getAttr (url: string) {
      return {
        src: url
      }
    }
  }
]
export function loadSources (urls: string[]): Promise<void> {
  const fragment = document.createDocumentFragment()
  const promises: Promise<void>[] = []
  urls.forEach(url => {
    const item = TagList.find(i => i.match.test(url))
    if (!item) {
      return
    }
    const tag = createTag(item.tag, item.getAttr(url))
    promises.push(new Promise((resolve, reject) => {
      tag.addEventListener('load', () => {
        console.log(url)
        resolve()
      }, { once: true })
      tag.addEventListener('error', (e) => reject(e), { once: true })
    }))
    fragment.appendChild(tag)
  })
  document.body.appendChild(fragment)
  return Promise.all(promises).then(() => {})
}

export interface Item {
  name: string;
  value: string;
  style: Record<string, string>
}

export function resolveThemes (obj: Record<string, any>): Item[] {
  return Object.keys(obj).map(key => {
    const conf = obj[key]
    return {
      name: key,
      value: key,
      style: {
        backgroundColor: conf['root-background'],
        color: conf['root-color'],
        borderRadius: conf['root-radius'] + 'px'
      }
    }
  })
}

export function resolveTemplates (obj: Record<string, any>): Item[] {
  return Object.keys(obj).map((key, i) => ({
    name: key,
    value: key,
    style: {
      backgroundPosition: `${-50 * i}px 0px`
    }
  }))
}
