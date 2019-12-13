const { api } = require('../utils')
const { Dapps } = require('../models')

const getAll = (req, res) => {
  const filter = { isDeleted: false }
  Dapps.scan(filter, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    return res.status(200).json({ success: true, message: 'Dapps fetched successfully', data, paginate: null })
  })
}

const getById = (req, res) => {
  const filter = { id: req.params.id, isDeleted: false }
  if (!filter.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(filter, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    if (!data || data.isDeleted) return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })
    return res.status(200).json({ success: true, message: 'Dapp fetched successfully', data, paginate: null })
  })
}

const created = (req, res) => {
  api
    .post('dapps/create')
    .then(resp => {
      const { status, error_msg, data } = resp
      if (status === 'failed') return res.status(400).json({ success: false, message: error_msg, data: null, paginate: null })

      const dappStatus = data.items[0].status
      if (dappStatus && dappStatus.conditions && dappStatus.conditions[0].status === 'False') {
        return res.status(400).json({ success: false, message: dappStatus.conditions[0].message, data: null, paginate: null })
      }

      const { apiVersion, metadata, spec } = data.items[0]
      const item = {
        dappUid: metadata.uid,
        dappCreated: metadata.creationTimestamp,
        name: metadata.name,
        port: spec.containers[0].ports[0].containerPort,
        pubkey: req.UserAuth.pub,
        hostIP: dappStatus.hostIP,
        phase: dappStatus.phase,
        apiVersion,
      }
      const dapps = new Dapps(item)
      dapps
        .save()
        .then(data => {
          return res.status(201).json({ success: true, message: 'Dapp created successfully', data, paginate: null })
        })
        .catch(error => {
          return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
        })
    })
    .catch(error => console.error(error))
}

const deleted = (req, res) => {
  const filter = { id: req.params.id, isDeleted: false }
  if (!filter.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(filter, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    if (!data || data.isDeleted) return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    const item = { isDeleted: true }
    Dapps.update({ id }, item, (err, data) => {
      if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
      return res.status(201).json({ success: true, message: 'Dapp deleted successfully', data, paginate: null })
    })
  })

  // const deleted = (req, res) => {
  //   Dapps.delete({ id: req.params.id }, (err, data) => {
  //     if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
  //     return res.status(200).json({ success: true, message: 'dApp deleted successfully', data, paginate: null })
  //   })
  // }
}

module.exports = { getAll, getById, created, deleted }
