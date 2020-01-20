import http from 'http'
import https from 'https'
import Koa from 'koa' // Koa applicaiton server

export async function createHttpServer({ serviceName, port, middlewareArray }) {
  const serverKoa = new Koa() // create Koa server
  serverKoa.subdomainOffset = 1 // for localhost domain.
  // register middleware
  middlewareArray.forEach(middleware => serverKoa.use(middleware))
  await new Promise(
    (resolve, reject) =>
      http
        .createServer(serverKoa.callback())
        .listen(port, () => {
          process.emit('service', { serviceName, port, status: 'ready', description: 'Server listening' })
          resolve()
        })
        .on('connection', socket => {
          // console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
          // socket.on('end', () => console.info('SOCKET END: other end of the socket sends a FIN packet'))
          // socket.on('timeout', () => console.info('SOCKET TIMEOUT'))
          // socket.on('error', error => console.info('SOCKET ERROR: ' + JSON.stringify(error)))
          // socket.on('close', had_error => console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error))
        }),
    // .setTimeout(0, () => console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')),
  )

  // if (ssl)
  // https
  //   .createServer({ key: serviceConfig.ssl.key, cert: serviceConfig.ssl.cert }, serverKoa.callback())
  //   .on('connection', socket => socket.setTimeout(120))
  //   .listen(443, () => console.log(`☕ ${serviceName} listening on port 443`))
}
