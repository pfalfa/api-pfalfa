require('dotenv').config()
const fs = require('fs')
const os = require('os')
const cors = require('cors')
const http = require('http')
const https = require('https')
const logger = require('morgan')
const helmet = require('helmet')
const cluster = require('cluster')
const express = require('express')
const dynamoose = require('dynamoose')
const bodyParser = require('body-parser')
const compression = require('compression')
const session = require('express-session')

const config = require('./config')
const routes = require('./routes')
const app = express().set('port', config.app.port)

/** config dynamo db */
dynamoose.AWS.config.update(config.dynamodb)
dynamoose.setDefaults({
  create: process.env.NODE_ENV === 'development' ? true : false,
  prefix: process.env.NODE_ENV === 'development' ? 'pfalfa-' : '',
  suffix: process.env.NODE_ENV === 'development' ? '-test' : '',
})

/** express server */
app.use(cors())
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false }))
app.use(bodyParser.json({ limit: '30mb', extended: false }))
app.use(helmet())
app.use(compression())
app.use(logger('dev'))
app.use(session({ secret: config.app.sessionSecret, resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }))

/** router */
routes(app)

/** cluster server */
const server =
  config.app.modeServer === 'http'
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync(config.app.openSslKeyPath),
          cert: fs.readFileSync(config.app.openSslCertPath),
        },
        app
      )
if (cluster.isMaster && config.app.modeCluster) {
  const cpus = os.cpus().length
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
  console.log(`Mode Cluster. Forking for ${cpus} CPUs`)
} else {
  const port = config.app.port
  server.listen(port, () => {
    console.log(`Start Express Server on Port ${port} Handled by Process ${process.pid}`)
    return
  })

  process.on('SIGINT', () => {
    server.close(err => {
      if (err) {
        console.error(`Error Express Server : ${err}`)
        process.exit(1)
        return
      }
      console.log(`Close Express Server on Port ${port} Handled by Process ${process.pid}`)
      process.exit(0)
    })
  })
}
