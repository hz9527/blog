const http = require('http')

http.createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.setHeader('Cache-Control', 'max-age=31536000')
    res.end(`<!DOCTYPE html>
    <html lang="en">
      <head></head>
      <body class="test">
       test
       <script>
        setTimeout(() => {
          const script = document.createElement('script');
          script.src = '/index.js';
          document.body.appendChild(script);
        }, 5000)
       </script>
      </body>
    </html>
    `)
  } else if (req.url === '/index.js') {
    res.setHeader('Content-Type', 'application/javascript')
    res.setHeader('Cache-Control', 'max-age=31536000')
    res.end('')
  }
}).listen(8080)
