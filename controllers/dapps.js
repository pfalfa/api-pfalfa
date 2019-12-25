const _ = require('lodash')
const { api } = require('../utils')
const { Dapps } = require('../models')

const getAll = (req, res) => {
  const filter = { isDeleted: false, pubkey: req.UserAuth.pub }
  Dapps.scan(filter, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    return res.status(200).json({ success: true, message: 'Dapps fetched successfully', data, paginate: null })
  })
}

const getById = (req, res) => {
  const filter = { id: req.params.id, isDeleted: false }
  if (!filter.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(filter, async (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    if (!data || data.isDeleted) return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    const dappUploads =
      data && data.ipfsHash
        ? await api.get(api.host.dev, `ipfs/list/${data.ipfsHash}`).then(resp => {
            return resp.data.length > 0 ? _.sortBy(resp.data, ['Type', 'Name']) : null
          })
        : []
    data.dappUploads = dappUploads
    return res.status(200).json({ success: true, message: 'Dapp fetched successfully', data, paginate: null })
  })
}

const created = (req, res) => {
  const { logoUrl, podName, category, description } = req.body
  if (!podName || !category) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { podName, port: 80 }
  api
    .post(api.host.dev, 'dapps/create', payload)
    .then(resp => {
      const { status, error_msg, data } = resp
      if (status === 'failed') return res.status(400).json({ success: false, message: error_msg, data: null, paginate: null })

      const { apiVersion, metadata, spec } = data.items[0]
      const item = {
        category,
        apiVersion,
        description,
        ipLocal: null,
        status: null,
        port: payload.port,
        name: metadata.name,
        dappUid: metadata.uid,
        pubkey: req.UserAuth.pub,
        dappDetail: data.items[0],
        logoUrl: logoUrl || null,
        dappCreated: metadata.creationTimestamp,
        gunDb: `${spec.clusterIP}:${spec.ports[0].port}/gun`,
        ipPublic: spec.loadBalancer && spec.loadBalancer.ingress ? spec.loadBalancer.ingress[0].ip : null,
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
    .catch(error => {
      return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
    })
}

const updated = (req, res) => {
  const filter = { id: req.params.id, isDeleted: false }
  if (!filter.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(filter, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    if (!data || data.isDeleted) return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    const item = { ...req.body, ipfsHash: req.body.ipfs_hash }
    Dapps.update({ id: filter.id }, item, (err, data) => {
      if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
      return res.status(201).json({ success: true, message: 'Dapp updated successfully', data, paginate: null })
    })
  })
}

const deleted = (req, res) => {
  const filter = { id: req.params.id, isDeleted: false }
  if (!filter.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(filter, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err, data: null, paginate: null })
    if (!data || data.isDeleted) return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    api
      .get(api.host.dev, `dapps/${data.name}/delete`)
      .then(resp => {
        const { status, error_msg } = resp
        if (status === 'failed') return res.status(400).json({ success: false, message: error_msg, data: null, paginate: null })

        const item = { isDeleted: true }
        Dapps.update({ id: filter.id }, item, (err, data) => {
          if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
          return res.status(201).json({ success: true, message: 'Dapp deleted successfully', data, paginate: null })
        })
      })
      .catch(error => {
        return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
      })
  })

  // const deleted = (req, res) => {
  //   Dapps.delete({ id: req.params.id }, (err, data) => {
  //     if (err) return res.status(500).json({ status: 500, success: false, message: err, data: null, paginate: null })
  //     return res.status(200).json({ success: true, message: 'dApp deleted successfully', data, paginate: null })
  //   })
  // }
}

module.exports = dapps = { getAll, getById, created, updated, deleted }
