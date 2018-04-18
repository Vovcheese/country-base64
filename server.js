const polka = require('polka')
const next = require('next')
const { json } = require('body-parser')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const knex = require('./utils/database')

function onError(e) {
  console.log(e)
}

app.prepare().then(() => {
  const server = polka({ onError })
    .use(json({ limit: '50mb' }))

  server.post('/', (req, res) => {
    knex('category-images').where('category', req.body.title).update('image', req.body.image)
      .then(res => {
        res.end(true)
      })
      .catch(err => {
        console.log(err)
        res.end(false)
      })
  })

  server.get('*', (req, res) => handle(req, res))

  server
    .listen(port)
    .then(() => console.log(`> Ready on http://localhost:${port}`))
})

process.on('unhandledRejection', (reason, p) => {
  console.log('unhandledRejection', reason)
})