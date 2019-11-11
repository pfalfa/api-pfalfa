module.exports = {
  app: {
    port: process.env.PORT,
    host: 'localhost',
    mainRoute: '/api',
    modeServer: 'http',
    modeCluster: false,
    sessionSecret: process.env.SESSION_SECRET,
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  db: {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  ihub: {
    host: process.env.HOST_IHUB,
  },
}
