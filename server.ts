import * as jsonServer from 'json-server'
import {Express} from 'express'
import * as fs from 'fs'
import * as https from 'https'
import {handleAuthentication} from './auth'
import {handleAuthorization} from './authz'

const server: Express = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

//middlewares
server.post('/login', handleAuthentication)
//O use serve para todos os métodos, GET, POST etc
server.use('/orders', handleAuthorization)

// Use default router
server.use(router)

const options = {
  cert: fs.readFileSync('./keys/cert.pem'),
  key: fs.readFileSync('./keys/key.pem') 
}


const port = process.env.PORT || 3001;

https.createServer(server).listen(port, () => {
  console.log('\n\n' + 'Node Server OK... ' );
})
