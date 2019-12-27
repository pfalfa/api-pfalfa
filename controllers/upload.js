const fs = require('fs')
const _ = require('lodash')
const AWS = require('aws-sdk')
const config = require('../config')

AWS.config.update(config.aws)
const S3 = new AWS.S3()

const s3 = (req, res) => {
  if (_.isEmpty(req.file)) return res.status(400).json({ success: false, message: 'Invalid payload', data: null, paginate: null })

  const key = Object.keys(req.file)[0]
  const val = req.file[key]
  const fileName = `${req.UserAuth.pub}-${new Date().getTime()}-${val.name}`
  if (key !== 'file')
    return res.status(400).json({ success: false, message: 'Field must be using "file" name', data: null, paginate: null })

  S3.putObject({
    Key: `dapps/${fileName}`,
    Bucket: config.aws.bucketUpload,
    Body: fs.readFileSync(val.path),
  })
    .promise()
    .then(resp => {
      const data = S3.getSignedUrl('getObject', { Bucket: config.aws.bucketUpload, Key: fileName })
      return res.status(200).json({ success: true, message: 'S3 Uploaded successfully', data, paginate: null })
    })
    .catch(error => {
      return res.status(500).json({ success: true, message: error.message, data: null, paginate: null })
    })
}

module.exports = upload = { s3 }
