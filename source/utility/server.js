import assert from 'assert'
import http from 'http'
import https from 'https'
import Net from 'net'
import Koa from 'koa' // Koa applicaiton server
// checks if port is in use, to verify proper working of server
const isPortTaken = port =>
  new Promise((resolve, reject) => {
    // checks in 0.0.0.0:<port>
    const tester = Net.createServer()
      .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
      .once('listening', () => tester.once('close', () => resolve(true)).close())
      .listen(port)
  })

export async function createHttpServer({ serviceName, port, host = '0.0.0.0', middlewareArray }) {
  const serverKoa = new Koa() // create Koa server
  serverKoa.subdomainOffset = 1 // for localhost domain.
  // register middleware
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

  return await new Promise(
    (resolve, reject) => {
      let server = http
        .createServer(serverKoa.callback())
        .listen({ port, host }, () => {
          process.emit('service', { serviceName, host, port, status: 'ready', description: 'Server listening' })
          isPortTaken(port).then(_isPortTaken => {
            assert(!_isPortTaken, `• Failed to run server on ${host}:${port}`) // make sure port is in use, and server started correctly
            resolve({
              name: serviceName, 
              connectionHandler: server, 
              // provide a function to close the server connection
              close: () => new Promise((resolve, reject) => {
                // a technique to close the server without tracking connections
                server.close(() => resolve())
                setImmediate(() => server.emit('close'))
              })
            })
          })
        })
        .on('connection', socket => {
          // console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
          // socket.on('end', () => console.info('SOCKET END: other end of the socket sends a FIN packet'))
          // socket.on('timeout', () => console.info('SOCKET TIMEOUT'))
          // socket.on('error', error => console.info('SOCKET ERROR: ' + JSON.stringify(error)))
          // socket.on('close', had_error => console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error))
        })
    }
    // .setTimeout(0, () => console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')),
  )

  // if (ssl)
  // https
  //   .createServer({ key: serviceConfig.ssl.key, cert: serviceConfig.ssl.cert }, serverKoa.callback())
  //   .on('connection', socket => socket.setTimeout(120))
  //   .listen(443, () => console.log(`☕ ${serviceName} listening on port 443`))
}
