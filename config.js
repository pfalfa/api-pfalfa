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
    sessionSecret: process.env.SESSION_SECRET,
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
  },
  dynamodb: {
    region: process.env.REGION || null,
    accessKeyId: process.env.ACCESS_KEY_ID || null,
    secretAccessKey: process.env.SECRET_ACCESS_KEY || null,
  },
  gundb: {
    fileName: 'db',
    host: process.env.GUNDB_PEERS || ['https://pfalfa-ihub.pfalfa.io/gun'],
  },
  api: {
    ihub: process.env.API_IHUB || 'https://pfalfa-ihub-api.pfalfa.io/api',
    dev: process.env.API_DEV || 'https://staging-pfalfa-api-dev.pfalfa.io',
  },
}
