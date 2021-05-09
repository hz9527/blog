import { getZoom, loadSources, Item, resolveThemes, resolveTemplates } from './utils'
declare let kityminder: any

const PADDING = 50
const DEPS = ['/mindmap/kity.min.js']
const SOURCES = ['/mindmap/mindmap.css', '/mindmap/mindmap.core.js']

export default class MindMap {
  static task: null | Promise<void> = null

  private zoom: number = 100

  private km: any = null

  constructor () {
    this.init()
  }

  private init (): Promise<void> {
    if (!MindMap.task) {
      MindMap.task = loadSources(DEPS).then(() => loadSources(SOURCES))
    }
    return MindMap.task
  }

  async render (target: HTMLElement, data: string | object, config = { maxHeight: 600, maxWidth: 10000 }): Promise<void> {
    await this.init()
    this.km = new kityminder.Minder()
    this.km.renderTo(target)
    this.km.importData('json', typeof data === 'string' ? data : JSON.stringify(data))
    // this.km.disable()
    this.km.execCommand('hand')
    const autoRemove = (name: string, fn: (...args: any[]) => any) => {
      const handler = (...args: any[]) => {
        const res = fn(...args)
        this.km.off(name, handler)
        return res
      }
      this.km.on(name, handler)
    }
    return new Promise((resolve) => {
      autoRemove('layoutallfinish', () => {
        const domRect = target.getBoundingClientRect()
        const { width, height } = this.km
          .getPaper()
          .shapeNode
          .getBoundingClientRect()
        const zoomX = getZoom(width, config.maxWidth)
        const zoomY = getZoom(height, config.maxHeight - PADDING)
        this.zoom = Math.min(zoomX, zoomY)
        const h = height * this.zoom / 100
        let resolveStatus = 0
        if (domRect.height < h + PADDING) {
          target.style.height = h + PADDING + 'px'
          this.km.fire('paperrender')
          resolveStatus = 2
        }
        if (this.zoom !== 100) {
          this.km.zoom(this.zoom)
          !resolveStatus && (resolveStatus = 1)
        }
        resolveStatus === 0
          ? resolve()
          : resolveStatus === 1
            ? requestAnimationFrame(() => resolve())
            : autoRemove('interactchange', () => resolve())
      })
    })
  }

  setZoom (zoom: number) {
    this.km && this.km.zoom(zoom)
  }

  getZoom (): number {
    return this.zoom
  }

  async getTemplates (): Promise<Item[]> {
    await this.init()
    const obj = kityminder.Minder.getTemplateList()
    console.log(obj)
    return resolveTemplates(obj)
  }

  getTemplate (): string {
    return this.km ? this.km.getTemplate() : ''
  }

  setTemplate (name: string) {
    this.km && this.km.execCommand('template', name)
  }

  async getThemes (): Promise<Item[]> {
    await this.init()
    const obj = kityminder.Minder.getThemeList()
    return resolveThemes(obj)
  }

  getTheme (): string {
    return this.km ? this.km.getTheme() : ''
  }

  setTheme (name: string) {
    this.km && this.km.execCommand('theme', name)
  }
}
