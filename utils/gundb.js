const Gun = require('gun/gun')
const config = require('../config')
require('gun/sea')
require('gun/lib/server')

// const gun = Gun([config.gundb.host])
const gun = Gun({ file: config.gundb.fileName, peers: config.gundb.host, axe: false })
const sea = Gun.SEA

module.exports = { gun, sea }
