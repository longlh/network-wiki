import path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import WebpackAssetsManifest from 'webpack-assets-manifest'

const ROOT_DIR = path.join(__dirname, '../..')
const ASSET_BASE_PATH = [
  process.env.ASSET_PREFIX || '/assets'
].join('/')

const PUBLIC_PATH = (process.env.CDN_HOST || '') + ASSET_BASE_PATH + '/'

export default {
  mode: 'production',
  entry: {
    'main-page': path.resolve(ROOT_DIR, '/src/views/main-page/index.js')
  },
  output: {
    publicPath: PUBLIC_PATH,
    path: path.join(ROOT_DIR, '.dist'),
    filename: 'js/[name].[contenthash:6].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'main-page.ect',
      template: path.join(ROOT_DIR, 'src/views/main-page/template.ect')
    }),
    new WebpackAssetsManifest({
      writeToDisk: true
    })
  ],
  module: {
    rules: []
  }
}
