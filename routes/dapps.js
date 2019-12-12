const router = require('express').Router()

const { authorization } = require('../utils')
const { dapps } = require('../controllers')

router.get('/:id', authorization, (req, res) => {
  dapps.getById(req, res)
})

router.get('/', authorization, (req, res) => {
  dapps.getAll(req, res)
})

router.post('/', authorization, (req, res) => {
  dapps.created(req, res)
})

router.put('/:id', authorization, (req, res) => {
  dapps.updated(req, res)
})

router.delete('/:id', authorization, (req, res) => {
  dapps.deleted(req, res)
})

module.exports = router
