require('dotenv').config()

module.exports = {
  app: {
    pageLimit: 10,
    route: '/api',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    port: process.env.PORT || 3033,
    loggerFilePath: './logs/access.log',
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET,
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
  },
  dynamodb: {
    region: process.env.REGION || null,
    accessKeyId: process.env.ACCESS_KEY_ID || null,
    secretAccessKey: process.env.SECRET_ACCESS_KEY || null,
  },
  api: {
    dev: process.env.API_DEV || 'http://localhost:8081˝',
    ihub: process.env.API_IHUB || 'http://localhost:3003/api',
  },
}
