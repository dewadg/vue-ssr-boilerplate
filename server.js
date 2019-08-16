const server = require('fastify')()
const consola = require('consola')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})

server.register(require('fastify-url-data'), (err) => {
  // Do nothing
})

server.get('*', async (request, reply) => {
  const context = {
    title: 'Hello, world!',
    meta: ``,
    url: request.urlData('path')
  }

  renderer.renderToString(context, (error, html) => {
    if (error) {
      if (error.status === 404) {
        reply
          .status(404)
          .send('Page not found.')

        return
      }

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
