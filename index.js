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
  create: true,
  prefix: 'pfalfa-',
  suffix: !config.app.nodeEnv ? '-staging' : '-production',
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
  !config.app.openSslKeyPath && !config.app.openSslCertPath
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync(config.app.openSslKeyPath),
          cert: fs.readFileSync(config.app.openSslCertPath),
        },
        app
      )
if (cluster.isMaster) {
  const cpus = os.cpus().length
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
  console.log(`Mode Cluster. Forking for ${cpus} CPUs`)
} else {
  const port = config.app.port
  server.listen(port, () => {
    console.log(`Start API Pfalfa on Port ${port} Handled by Process ${process.pid}`)
    return
  })

  process.on('SIGINT', () => {
    server.close(err => {
      if (err) {
        console.error(`Error API Pfalfa : ${err}`)
        process.exit(1)
        return
      }
      console.log(`Close API Pfalfa on Port ${port} Handled by Process ${process.pid}`)
      process.exit(0)
    })
  })
}
