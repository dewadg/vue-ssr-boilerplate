const server = require('fastify')()
const consola = require('consola')

const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

const createApp = require('./app')

server.get('*', (request, reply) => {
  const context = {
    title: 'Hello, world!',
    meta: ``
  }

  const app = createApp(context)

  renderer.renderToString(app, context, (error, html) => {
    if (error) {
      reply
        .status(500)
        .send('Internal server error.')

      consola.error(error)
      return
    }

    reply
      .type('text/html')
      .send(html)
  })
})

async function start () {
  try {
    await server.listen(8000)

    consola.ready({
      badge: true,
      message: `App is runing on port 8000`
    })
  } catch (error) {
    consola.error(error)
  }
}

start()
