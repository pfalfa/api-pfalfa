const router = require('express').Router()

const config = require('../config')
const gun = Gun({ file: 'db', peers: [config.db.peers] })

router.get('/', (req, res) => {
  const { authorization } = req.headers
  if (!authorization) return res.status(400).json({ success: false, message: 'Invalid format header request', data: null })
  getUserByPubKey(authorization, (err, result) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null })
    return res.status(result.status).json(result)
  })
})

router.get('/:pubkey', (req, res) => {
  const { pubkey } = req.params
  if (!pubkey) return res.status(400).json({ success: false, message: 'Invalid format params request', data: null })
  getUserByPubKey(pubkey, (err, result) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null })
    return res.status(result.status).json(result)
  })
})

const getUserByPubKey = (pubkey, callback) => {
  try {
    gun.user(pubkey).once(data => {
      if (!data)
        return callback(null, {
          status: 403,
          success: false,
          message: 'You do not have enough permission to perform this action',
          data: null,
        })

      delete data._
      delete data.auth
      return callback(null, { status: 200, success: true, message: null, data })
    })
  } catch (error) {
    return callback(error, null)
  }
}

module.exports = router
