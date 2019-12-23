const router = require('express').Router()

const { authorization } = require('../utils')
const { ipfs } = require('../controllers')

router.get('/list/:hash', authorization, (req, res) => {
  ipfs.getByHash(req, res)
})

module.exports = router
