const router = require('express').Router()
const { auth } = require('../controllers')

router.post('/register', (req, res) => {
  auth.register(req, res)
})

router.post('/login', (req, res) => {
  auth.login(req, res)
})

router.post('/forgot', (req, res) => {
  auth.forgot(req, res)
})

router.post('/reset', (req, res) => {
  auth.reset(req, res)
})

router.post('/change-passphare', (req, res) => {
  auth.changePassphare(req, res)
})

module.exports = router
