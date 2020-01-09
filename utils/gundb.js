const Gun = require('gun')
const config = require('../config')
require('gun/sea')
require('gun/lib/webrtc')
// require('gun/lib/server')

const gun = Gun({ file: 'db', peers: config.gundb.peers, axe: false })

module.exports = gundb = { gun }
