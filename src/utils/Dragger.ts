import { noop } from './utils'

export interface EventInfo {
  startX: number;
  currentX: number;
  startY: number;
  currentY: number;
  // shiftKey: shiftKey
}

interface Handlers {
  start(info: EventInfo): void;
  move(info: EventInfo): void;
  end(info: EventInfo): void;
}

const DefaultHandlers: Handlers = { start: noop, move: noop, end: noop }

export default class Dragger {
  static hasTasks = false;

  private startX: number = -1;
  private startY: number = -1;
  private target: Element;
  private cursor: string;
  private handlers: Handlers;

  constructor (target: Element, handlers: Partial<Handlers>, cursor = 'ew-resize') {
    this.target = target
    this.cursor = cursor
    this.handlers = {
      ...DefaultHandlers,
      ...handlers
    }
    this.start()
  }

  private startHandler = (e: Event) => {
    if (Dragger.hasTasks) {
      return
    }
    Dragger.hasTasks = true
    this.startX = (e as MouseEvent).pageX
    this.startY = (e as MouseEvent).pageY
    document.addEventListener('mousemove', this.moveHandler)
    document.addEventListener('mouseup', this.endHandler, { once: true })
    this.handlers.start(this.getData(e as MouseEvent))
    document.body.style.cursor = this.cursor
    document.body.style.userSelect = 'none'
  }

  setCursor (cursor: string) {
    this.cursor = cursor
  }

  private moveHandler = (e: Event) => {
    this.handlers.move(this.getData(e as MouseEvent))
  }

  private endHandler = (e: Event) => {
    setTimeout(() => {
      Dragger.hasTasks = false
    }, 300)
    this.handlers.end(this.getData(e as MouseEvent))
    document.removeEventListener('mousemove', this.moveHandler)
    document.body.style.removeProperty('cursor')
    document.body.style.removeProperty('user-select')
  }

  private getData (e: MouseEvent): EventInfo {
    return {
      startX: this.startX,
      currentX: e.pageX,
      startY: this.startY,
      currentY: e.pageY
    }
  }

  start () {
    this.target.addEventListener('mousedown', this.startHandler)
  }

  stop () {
    this.target.removeEventListener('mousedown', this.start)
  }
}
