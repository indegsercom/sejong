// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const cors = require('micro-cors')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    if (req.method === 'OPTIONS') {
      return cors({ origin: req.headers['origin'] })((req, res) => {
        res.end()
      })(req, res)
    }
    handle(req, res, parsedUrl)
  }).listen(3030, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3030')
  })
})
