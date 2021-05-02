import { Tree, Headline } from '../../types/index'

interface Option<D> {
  changeHandler: (data: {[k: string]: boolean}) => void;
  getId?: (item: D) => string;
  selector?: (item: D) => Element | null
}

type FOpt<D> = Required<Option<D>>

function walk<D extends Record<string, any>> (
  tree: Tree<D>, handler: (data: D) => void
): void {
  for (let i = 0, l = tree.length; i < l; i++) {
    const item = tree[i]
    handler(item)
    item.children && walk(item.children, handler)
  }
}

export default class Scroll<D = Headline> {
  private changeHandler: FOpt<D>['changeHandler']
  private selector: FOpt<D>['selector']
  private getId: FOpt<D>['getId']
  private tree!: Tree<D>
  private infoMap: Map<Element, string> = new Map()
  private cache: {[k: string]: boolean} = {}
  private io: IntersectionObserver
  constructor ({
    changeHandler,
    getId = (item) => (item as unknown as Headline).value,
    selector = (item) => document.getElementById(
      (item as unknown as Headline).value
    )
  }: Option<D>) {
    this.changeHandler = changeHandler
    this.getId = getId
    this.selector = selector
    this.io = new IntersectionObserver(this.handler)
  }

  update (tree: Tree<D>) {
    this.tree && this.unobserve()
    this.tree = tree
    this.observe()
  }

  private observe () {
    walk(this.tree, item => {
      const target = this.selector(item)
      if (!target) {
        return
      }
      const id = this.getId(item)
      this.infoMap.set(target, id)
      this.cache[id] = false
      this.io.observe(target)
    })
  }

  private unobserve () {
    this.infoMap.clear()
    this.cache = {}
    walk(this.tree, (item) => {
      const target = this.selector(item)
      target && this.io.unobserve(target)
    })
  }

  private handler = (list: IntersectionObserverEntry[]): void => {
    list.forEach(item => {
      const id = this.infoMap.get(item.target)
      if (typeof id !== 'undefined') {
        this.cache[id] = item.isIntersecting
      }
    })
    this.changeHandler(this.cache)
  }
}
