require('dotenv').config()

const server = require('fastify')()
const consola = require('consola')
const fs = require('fs')
const path = require('path')
const serveStatic = require('serve-static')
const { createBundleRenderer } = require('vue-server-renderer')

const isProduction = process.env.NODE_ENV === 'production'
const host = '0.0.0.0'
const port = 8503

const devServer = !isProduction ? require('./webpack/dev-server') : null
const templatePath = path.resolve(__dirname, 'index.template.html')

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, {
    ...options,
    runInNewContext: false,
    basedir: path.resolve(__dirname, './dist')
  })
}

async function start () {
  try {
    await server.listen(port, host)

    consola.ready({
      badge: true,
      message: `App is runing on port ${port}`
    })
  } catch (error) {
    consola.error(error)
  }
}

let renderer
let ready

if (isProduction) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')

  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  ready = devServer(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

server.register(require('fastify-url-data'), (err) => {
  // Do nothing
})

server.use('/dist', serveStatic('./dist'))
server.use('/public', serveStatic('./public'))

server.get('*', async (request, reply) => {
  await ready

  const context = {
    title: process.env.VUE_APP_NAME || 'Hello, world!',
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

start()
