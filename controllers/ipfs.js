const _ = require('lodash')
const { api } = require('../utils')

const upload = (req, res) => {
  if (_.isEmpty(req.file)) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const key = Object.keys(req.file)[0]
  const val = req.file[key]
  if (key !== 'file')
    return res.status(400).json({ success: false, message: 'Field must be using "file" name', data: null, paginate: null })

  api
    .upload(api.host.dev, 'ipfs/adddir', val, key)
    .then(resp => {
      const { status, data } = resp
      if (status !== 'success') return res.status(400).json({ success: false, message: resp.message, data: null, paginate: null })
      return res.status(200).json({ success: true, message: 'Ipfs Uploaded successfully', data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
    })
}

const getByHash = (req, res) => {
  const { hash } = req.params
  if (!hash) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  api
    .get(api.host.dev, `ipfs/list/${hash}`)
    .then(resp => {
      const { status, error_msg, data } = resp
      if (status === 'failed') return res.status(400).json({ success: false, message: error_msg, data: null, paginate: null })

      const dataIpfs = data.map(item => {
        if (item.Name === '__MACOSX') {
          item.Type = 3
        }
        return item
      })
      const datas = data.length > 0 ? _.sortBy(dataIpfs, ['Type', 'Name']) : null
      return res.status(200).json({ success: true, message: 'Ipfs fetched successfully', data: datas, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
    })
}

module.exports = ipfs = { upload, getByHash }
