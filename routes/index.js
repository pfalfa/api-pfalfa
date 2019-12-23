const config = require('../config')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: config.app.rateLimitSuspendTime * 60 * 1000,
  max: config.app.rateLimitMaxHitPerIP,
})

module.exports = app => {
  app.use(`${config.app.mainRoute}/dapps`, limiter, require('./dapps'))
  app.use(`${config.app.mainRoute}/ipfs`, limiter, require('./ipfs'))
}
