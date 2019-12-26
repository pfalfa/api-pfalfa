const router = require('express').Router()
const multipart = require('connect-multiparty')

const multipartMiddleware = multipart()
const { authorization } = require('../utils')
const { ipfs } = require('../controllers')

router.post('/upload', authorization, multipartMiddleware, (req, res) => {
  req.file = req.files
  ipfs.upload(req, res)
})

router.get('/list/:hash', authorization, (req, res) => {
  ipfs.getByHash(req, res)
})

module.exports = router
