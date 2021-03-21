const fastify = require('fastify')()
const fastifyVite = require('fastify-vite')
const fastifyApi = require('fastify-api')

const { feeds } = require('./feeds')
const { fetchFeed, fetchItem, fetchItemWithComments, fetchUser } = require('./methods')

async function main () {
  await fastify.register(fastifyApi)
  await fastify.register(fastifyVite, {
    api: true,
    clientEntryPath: '/entry/client.js',
    serverEntryPath: '/entry/server.js'
  })

  fastify.get('/', (_, reply) => reply.redirect('/top'))
  fastify.get('/favicon.ico', (_, reply) => {
    reply.code(404)
    reply.send('')
  })
  fastify.setErrorHandler((err, _, reply) => reply.send(err))

  fastify.api.get('/api/hn/item/:id', fetchItem)
  fastify.api.get('/api/hn/item/:id/full', fetchItemWithComments)
  fastify.api.get('/api/hn/user/:id', fetchUser)
  fastify.api.get('/api/hn/:feed/:page', fetchFeed)

  fastify.vite.global = {
    feeds: Object.keys(feeds)
  }

  fastify.vite.get('/user/:id')
  fastify.vite.get('/item/:id')
  fastify.vite.get('/:feed/:page')
  fastify.vite.get('/:feed')

  await fastify.listen(4000)

  console.log('Listening at http://localhost:4000')
}

main()
