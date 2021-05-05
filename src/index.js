import ect from 'ect'
import express from 'express'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'

const PORT = process.env.PORT || 5000
const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT || 9999

const ROOT_DIR = path.join(__dirname, '..')
const MANIFEST_FILE_PATH = process.env.MANIFEST_FILE_PATH || path.join(ROOT_DIR, '.dist/assets-manifest.json')

console.log(MANIFEST_FILE_PATH)

const main = async () => {
  const app = express()

  const manifest = await fs.readJSON(MANIFEST_FILE_PATH)

  const templates = Object.entries(manifest).reduce((templates, [key, value]) => {
    if (key.endsWith('.ect')) {
      templates[key] = value
    }

    return templates
  }, {})

  console.log(manifest, templates)

  // setup view engine
  // const viewDir = path.resolve(__dirname, '../.dist')
  // const renderer = ect({
  //   watch: true,
  //   root: viewDir,
  //   ext: '.ect'
  // })

  const remoteRender = async (template, options) => {
    const remoteUrl = `http://localhost:${DEV_SERVER_PORT}/assets/${template}.ect`

    const templateRes = await fetch(remoteUrl)

    if (!templateRes.ok) {
      throw templateRes
    }

    const templateContent = await templateRes.text()

    const renderer = ect({
      root: {
        template: templateContent
      }
    })

    return renderer.render('template', options)
  }

  // app.set('views', process.env.NODE_ENV === 'production' ?
  //   viewDir : `http://localhost:${DEV_SERVER_PORT}`
  // )
  // app.set('view engine', 'ect')
  // app.engine('ect', (filePath, options, callback) => {
  //   console.log(filePath, options)

  //   callback(null, 'hello world')
  // })

  // override .render()
  app.use((req, res, next) => {
    res.render = async (template, options) => {
      res.set('content-type', 'text/html')

      const content = await remoteRender(template, options)

      res.status(200).send(content)
    }

    next()
  })

  app.use('/assets', createProxyMiddleware({
    target: `http://localhost:${DEV_SERVER_PORT}`,
    changeOrigin: true
  }))


  app.get('/', (req, res) => res.render('main-page', { arg: 'world' }))

  // finally
  app.listen(5000, () => console.log('started'))
}

main()
