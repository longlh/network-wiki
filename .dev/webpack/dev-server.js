import express from 'express'

import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import TimeFixPlugin from 'time-fix-plugin'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'

import config from './config.babel'

const PORT = process.env.DEV_SERVER_PORT || 9999
const state = {
  isStarted: false
}

const compiler = webpack(
  new SpeedMeasurePlugin({
    disable: false
  }).wrap({
    ...config,
    mode: 'development',
    plugins: [
      new TimeFixPlugin(),
      ...config.plugins
    ]
  })
)

// init express server
const devServer = express()

devServer.get('/alive', (req, res) => res.sendStatus(204))

devServer.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    // logLevel: 'warn',
    writeToDisk: false
  })
)

// start dev-server when bundling finishes
compiler.hooks.done.tap('done', () => {
  if (state.isStarted) {
    return
  }

  devServer.listen(PORT, () => {
    state.isStarted = true

    console.log(`dev-server started at: ${PORT}`)
  })
})
