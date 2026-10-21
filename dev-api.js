// Vite plugin for local work. `npm run dev` serves the files in api/ with the same
// handler shape as Vercel, so the app runs without a Vercel account.
// It also allows a model server on this machine (such as Ollama). This is never set on Vercel.
function readJson(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        resolve({})
      }
    })
  })
}

// Vercel adds status() and json() to the response. Node's response does not have them.
function addVercelHelpers(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
    return res
  }
}

export default function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\//, '')
        if (!/^[a-z]+$/.test(name)) return next()
        // Set here, not when the server starts: the test runner also starts a Vite server.
        process.env.ALLOW_PRIVATE_PROVIDER = '1'
        try {
          const { default: handler } = await server.ssrLoadModule(`/api/${name}.js`)
          req.body = await readJson(req)
          addVercelHelpers(res)
          await handler(req, res)
        } catch (err) {
          server.config.logger.error(err.message)
          if (!res.headersSent) res.status(500).json({ error: { code: 'provider_error', message: 'The function failed.' } })
          else res.end()
        }
        return undefined
      })
    },
  }
}
