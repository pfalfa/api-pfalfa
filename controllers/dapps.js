const _ = require('lodash')
const uuidv1 = require('uuid/v1')
const { api, util } = require('../utils')
const { Dapps } = require('../models')

const getAll = (req, res) => {
  const params = { isDeleted: false, pubkey: req.UserAuth.pub }
  Dapps.scan(params, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err.message, data: null, paginate: null })

    const items =
      data && data.Items && data.Items.length > 0
        ? data.Items.map(i => {
            i.dappDetail = JSON.parse(i.dappDetail)
            return i
          })
        : []

    return res.status(200).json({ success: true, message: 'Dapps fetched successfully', data: items, paginate: null })
  })
}

const getById = (req, res) => {
  const params = { id: req.params.id }
  const exp = 'isDeleted = :isDeleted'
  const att = { ':isDeleted': false }
  if (!params.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(params, exp, att, async (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err.message, data: null, paginate: null })
    if (util.isObjEmpty(data) || data.Item.isDeleted)
      return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    const item = data && data.Item
    item.dappUploads =
      data && data.ipfsHash
        ? await api.get(api.host.dev, `ipfs/list/${data.ipfsHash}`).then(resp => {
            return resp.status === 'success' ? _.sortBy(resp.data, ['Type', 'Name']) : []
          })
        : []

    return res.status(200).json({ success: true, message: 'Dapp fetched successfully', data: item, paginate: null })
  })
}

const created = (req, res) => {
  const { logoUrl, podName, category, description } = req.body
  if (!podName || !category) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const payload = { pod_name: podName, port: 80 }
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
        gunDb: null,
        id: uuidv1(),
        ipLocal: null,
        ipLocal: null,
        ipfsHash: null,
        isDeleted: false,
        port: payload.port,
        name: metadata.name,
        dappStatus: 'pending',
        dappUid: metadata.uid,
        pubkey: req.UserAuth.pub,
        logoUrl: logoUrl || null,
        dappDetail: data.items[0],
        createdAt: metadata.creationTimestamp,
        dappCreated: metadata.creationTimestamp,
        ipPublic: spec.loadBalancer && spec.loadBalancer.ingress ? spec.loadBalancer.ingress[0].ip : null,
      }

      Dapps.post(item, err => {
        if (err) return res.status(500).json({ success: true, message: err.message, data: null, paginate: null })
        return res.status(201).json({ success: true, message: 'Dapp created successfully', data: item, paginate: null })
      })
    })
    .catch(error => {
      return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
    })
}

const updated = (req, res) => {
  const params = { id: req.params.id }
  const exp = 'isDeleted = :isDeleted'
  const att = { ':isDeleted': false }
  if (!params.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(params, exp, att, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err.message, data: null, paginate: null })
    if (util.isObjEmpty(data) || data.Item.isDeleted)
      return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    const item = data && data.Item
    const exp = 'set ipfsHash = :ipfsHash'
    const att = { ':ipfsHash': req.body.ipfsHash }
    Dapps.put(params, exp, att, err => {
      if (err) return res.status(500).json({ status: 500, success: false, message: err.message, data: null, paginate: null })
      item.ipfsHash = req.body.ipfsHash
      return res.status(201).json({ success: true, message: 'Dapp updated successfully', data: item, paginate: null })
    })
  })
}

const deleted = (req, res) => {
  const params = { id: req.params.id }
  const exp = 'isDeleted = :isDeleted'
  const att = { ':isDeleted': false }
  if (!params.id) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  Dapps.get(params, exp, att, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err.message, data: null, paginate: null })
    if (util.isObjEmpty(data) || data.Item.isDeleted)
      return res.status(400).json({ success: false, message: 'Dapp not found', data: null, paginate: null })

    api
      .get(api.host.dev, `dapps/${data.Item.name}/delete`)
      .then(resp => {
        const { status, error_msg } = resp
        if (status === 'failed') return res.status(400).json({ success: false, message: error_msg, data: null, paginate: null })

        const item = data && data.Item
        const exp = 'set isDeleted = :isDeleted'
        const att = { ':isDeleted': true }
        Dapps.put(params, exp, att, err => {
          if (err) return res.status(500).json({ status: 500, success: false, message: err.message, data: null, paginate: null })
          return res.status(201).json({ success: true, message: 'Dapp updated successfully', data: item, paginate: null })
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
