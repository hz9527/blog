function rewriteConsole (
  send: (key: string, values: {code: number; data: string}[]) => void
) {
  for (const key in console) {
    const fn = console[key as keyof typeof console]
    console[key as keyof typeof console] = (...args: any[]) => {
      send(key, args.map(item => {
        try {
          return { code: 0, data: JSON.stringify(item) }
        } catch (e) {
          return { code: -1, data: e.message }
        }
      }))
      fn(...args)
    }
  }
}

export default class Runtime {
  private iframe: HTMLIFrameElement;

  private listenerMap: Map<string, ((data: any) => void)[]> = new Map()

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
      list && list.forEach(data.data)
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

  update (content: {html: string;js:string;css:string}): void {
    this.iframe.style.display = content.html ? 'block' : 'none'
    this.iframe.src = `data:text/html,<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Vite App</title>
        ${content.css ? '<script>' + content.css + '</script>' : ''}
      </head>
      <body>
        ${content.html || ''}
        <script>
          (function() {
            function send(data) {
              window.top.postMessage(JSON.stringify(data), '*')
            }
            (${rewriteConsole.toString()})((key, values) => {
              send({
                cmd: 'console',
                data: {key, values}
              });
            });
            window.addEventListener('error', (e) => {
              send({cmd: 'error', data: {message: e.error.message, stack: e.error.stack || null}})
            });
            window.addEventListener('unhandledrejection', (e) => {
              send({cmd: 'error', data: {message: reason || null, stack: null}})
            });
          })()
          console.log(123)
        </script>
        ${content.js ? '<script>' + content.js + '</script>' : ''}
      </body>
    </html>
    `
    !Array.prototype.some.call(this.root.children, (el) => el === this.iframe) &&
    this.root.appendChild(this.iframe)
  }
}
