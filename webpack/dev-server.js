const fs = require('fs')
const path = require('path')
const MemoryFileSystem = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const consola = require('consola')

const serverConfig = require('./server.config')
const clientConfig = require('./client.config')

function readFile (customFs, file) {
  try {
    return customFs.readFile(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (error) {
    // Do nothing
  }
}

module.exports = function (server, templatePath, callback) {
  let bundle
  let template
  let clientManifest
  let ready

  const readyPromise = new Promise(r => ready = r)

  const update = () => {
    if (!bundle || !clientManifest) return

    ready()

    callback(bundle, {
      template,
      clientManifest
    })
  }

  template = fs.readFileSync(templatePath, 'utf-8')

  chokidar
    .watch(templatePath)
    .on('change', () => {
      template = fs.readFileSync(templatePath, 'utf-8')
      consola.info('index.template.html has been updated')

      update()
    })

  // Client
  clientConfig.entry.server = ['webpack-hot-middleware/client', clientConfig.entry.server]
  clientConfig.output.filename = '[name].js'

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })

  server.use(devMiddleware)

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()

    stats.errors.forEach((error) => {
      consola.error(error)
    })

    stats.warnings.forEach((warning) => {
      consola.warning(warning)
    })

    if (stats.errors.length) return

    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))

    update()
  })

  server.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

  // Server
  const serverCompiler = webpack(serverConfig)
  const mfs = new MemoryFileSystem()

  serverCompiler.outputFileSystem = mfs

  serverCompiler.watch({}, (error, stats) => {
    if (error) {
      consola.error(error)
    }

    stats = stats.toJson()

    stats.errors.forEach((error) => {
      consola.error(error)
    })

    if (stats.errors.length) return

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))

    update()
  })

  return readyPromise
}
