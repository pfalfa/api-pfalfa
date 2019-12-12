const Gun = require('gun/gun')
const config = require('../config')
require('gun/sea')
require('gun/lib/server')

const gun = Gun(config.gundb.host)
const sea = Gun.SEA

module.exports = { gun, sea }
