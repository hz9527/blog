export interface Data {
  js: string;
  css: string;
  html: string;
}

export interface InitState {
  editor: Boolean | null;
  result: Boolean | null;
}

export function getState (v: Boolean | null): string {
  return v === false ? 'min' : v ? 'max' : 'left'
}

export const Beat = '__INNER_CMD_BEAT'

function rewriteConsole (
  send: (key: string, values: {code: number; data: string}[]) => void
) {
  for (const key in console) {
    const fn = console[key as keyof typeof console]
    console[key as keyof typeof console] = (...args: any[]) => {
      send(key, args.map(item => {
        try {
          return { code: 0, data: JSON.stringify(item) } // todo
        } catch (e) {
          return { code: -1, data: e.message }
        }
      }))
      fn(...args)
    }
  }
}

export function getHtml (content: Data): string {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Vite App</title>
      ${content.css ? ('<style>' + content.css + '</style>') : ''}
    </head>
    <body>
      ${content.html || ''}
      <script>
        (function() {
          function send(data) {
            window.top.postMessage(JSON.stringify(data), '*')
          }
          ;(${rewriteConsole.toString()})((key, values) => {
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
      </script>
      ${content.js ? ('<script>' + content.js + '</script>') : ''}
    </body>
  </html>`
}

export function resolveLog (data: {key: string; values: string[]}): string {
  console.log(data)
  return `<div class="logger-${data.key}">${
    data.values.map((item: any) => item.code === 0 ? item.data : '<div class="logger-error">JSON Stringify fail</div>')
  }</div>`
}
