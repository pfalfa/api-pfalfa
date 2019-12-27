const router = require('express').Router()
const multipart = require('connect-multiparty')

const multipartMiddleware = multipart()
const { authorization } = require('../utils')
const { upload } = require('../controllers')

router.post('/s3', authorization, multipartMiddleware, (req, res) => {
  req.file = req.files
  upload.s3(req, res)
})

module.exports = router
