module.exports = {
  app: {
    port: process.env.PORT,
    host: process.env.HOST || 'localhost',
    mainRoute: '/api',
    modeServer: 'http',
    modeCluster: true,
    sessionSecret: process.env.SESSION_SECRET,
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  dynamodb: {
    region: process.env.REGION || '',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
  },
  gundb: {
    host: 'https://pfalfa-ihub.pfalfa.io/gun',
  },
  api: {
    ihub: process.env.API_IHUB,
    dev: process.env.API_DEV,
  },
}
