import fs from 'fs'
import express, {Request, Response} from 'express'
import {createServer} from 'vite'

const app = express()

createServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
}).then(async (vite) => {

  app.use(vite.middlewares)

  app.use('/api', (await vite.ssrLoadModule('/src/api/entry-api.ts')).apiRouter)

  app.use('*', async (req: Request, res: Response) => {
    const url = req.originalUrl

    try {
      const template = await vite.transformIndexHtml(url, fs.readFileSync('index.html', 'utf-8'))
      const {render, getServerData} = await vite.ssrLoadModule('/src/ssr/entry-ssr.tsx')
      const data = await getServerData()
      const script = `<script>window.__data__=${JSON.stringify(data)}</script>`


      const html = template.replace(`<!--outlet-->`, `${render(data)} ${script}`)
      res.status(200).set({'Content-Type': 'text/html'}).end(html)
    } catch (error) {
      res.status(500).end(error)
    }
  })

  app.listen(4173, () => {
    console.log('http://localhost:4173.')
  })
})