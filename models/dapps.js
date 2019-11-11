const dynamoose = require('dynamoose')

const { dappsSchema } = require('../schemas')
const Dapps = dynamoose.model('dapps', dappsSchema)

module.exports = Dapps
