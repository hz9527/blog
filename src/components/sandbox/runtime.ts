import { Data, getHtml } from './utils'

export default class Runtime {
  private iframe: HTMLIFrameElement;

  private listenerMap: Map<string, ((data: any) => void)[]> = new Map();

  constructor (private root: Element) {
    this.iframe = document.createElement('iframe')
    this.iframe.frameBorder = '0'
    window.addEventListener('message', this.messageHandler)
  }

  messageHandler = (e: MessageEvent) => {
    if (this.iframe.contentWindow !== e.source) {
      return
    }
    const data = JSON.parse(e.data)
    if (data && data.cmd) {
      const list = this.listenerMap.get(data.cmd)
      list && list.forEach(fn => fn(data.data))
    }
  }

  on (cmd: string, handler: (data: any) => void) {
    let list = this.listenerMap.get(cmd)
    if (!list) {
      list = []
      this.listenerMap.set(cmd, list)
    }
    list.push(handler)
  }

  destroy () {
    window.removeEventListener('message', this.messageHandler)
  }

  update (content: Data): void {
    this.iframe.style.display = content.html ? 'block' : 'none'
    this.iframe.src = `data:text/html,${encodeURIComponent(getHtml(content))}`
    !Array.prototype.some.call(this.root.children, (el) => el === this.iframe) &&
    this.root.appendChild(this.iframe)
  }
}
