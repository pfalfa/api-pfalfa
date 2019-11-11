const router = require('express').Router()

const { authorization } = require('../utils')
const { Dapps } = require('../models')

router.get('/:id', authorization, (req, res) => {
  Dapps.get({ id: req.params.id }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
    return res.status(200).json({ success: true, message: 'dApp fetched successfully', data, paginate: null })
  })
})

router.get('/', authorization, (req, res) => {
  const params = {}
  Dapps.scan(params, (err, data) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
    return res.status(200).json({ success: true, message: 'dApp fetched successfully', data, paginate: null })
  })
})

router.post('/', authorization, (req, res) => {
  const { domain, port, hash, status, expires } = req.body
  const pubkey = req.UserAuth.pub
  if (!domain || !pubkey || !hash || !status)
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.scan({ domain }, (err, results) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err.message, data: null, paginate: null })
    if (results.count > 0) return res.status(400).json({ success: false, message: 'Domain already exist', data: null, paginate: null })

    const item = { domain, port: port || null, pubkey, hash, status, expires: expires || null }
    const dapps = new Dapps(item)
    dapps
      .save()
      .then(data => {
        return res.status(201).json({ success: true, message: 'dApp created successfully', data, paginate: null })
      })
      .catch(err => {
        console.error('Dapps Post ', err)
      })
  })
})

router.put('/:id', authorization, (req, res) => {
  const { domain, port, hash, status, expires } = req.body
  const pubkey = req.UserAuth.pub
  if (!domain || !pubkey || !hash || !status)
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const item = { domain, port: port || null, pubkey, hash, status, expires: expires || null }
  Dapps.update({ id: req.params.id }, item, (err, data) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
    return res.status(201).json({ success: true, message: 'dApp updated successfully', data, paginate: null })
  })
})

router.delete('/:id', authorization, (req, res) => {
  Dapps.delete({ id: req.params.id }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
    return res.status(200).json({ success: true, message: 'dApp deleted successfully', data, paginate: null })
  })
})

module.exports = router
