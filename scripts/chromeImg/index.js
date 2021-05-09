const path = require('path')
const fs = require('fs')
const http = require('http')
const getIconInfos = require('./icons')

const Root = 'Images'
function getFiles (base = path.resolve(__dirname, `./${Root}`)) {
  return fs.promises.readdir(base)
    .then((names) => {
      const { files, dirs } = names.reduce((res, name) => {
        const item = path.join(base, name)
        fs.statSync(item).isDirectory() ? res.dirs.push(item) : res.files.push(item)
        return res
      }, { files: [], dirs: [] })
      return Promise.all([
        files,
        ...(dirs.map(dir => getFiles(dir)))
      ]).then(list => list.flat())
    })
}
console.log(getIconInfos().length)
const getHtml = (() => {
  const task = getFiles()
  return async () => {
    const imgs = await task
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>chrome devtools images</title>
        <style>
        .item {
          display: inline-block;
        }
          img {
            max-width: 200px;
            max-height: 200px;
          }
          .icons {
            display: flex;
            flex-wrap: wrap;
          }
          .large-icon {
            display: inline-block;
            -webkit-mask-image: url(Images/test.svg);
            background-color: #333;
          }
        </style>
      </head>
      <body class="test">
        <div class="icons">
        ${
          getIconInfos().map(info => `<div>
            <span 
            class="large-icon"
            style="width: ${info.width};height: ${info.height};-webkit-mask-position: ${info.x} ${info.y};"
            data-info="${JSON.stringify(info)}"
            ></span>
          </div>`).join('')
        }
        </div>
        ${
          imgs.map(img => {
            const src = path.relative(__dirname, img)
            return `
              <div class="item">
                <img src="${src}"/>
                <div>${src}</div>
              </div>
              `
          }).join('')
        }
      </body>
    </html>`
  }
})()

const Conf = {
  svg: 'image/svg+xml',
  png: 'image/png'
}
function getHeader (file) {
  const ext = path.extname(file)
  return Conf[ext.slice(1)]
}
http.createServer(async (req, res) => {
  if (req.url === '/') {
    const html = await getHtml()
    res.setHeader('content-type', 'text/html; charset=UTF-8')
    res.write(html)
    res.end()
  } else if (req.url.indexOf(`/${Root}`) === 0) {
    const type = getHeader(req.url)
    if (!type) {
      res.statusCode = 404
      res.end()
      return
    }
    res.setHeader('content-type', getHeader(req.url))
    fs.createReadStream(path.join(__dirname, req.url)).pipe(res)
  }
}).listen(8080)
