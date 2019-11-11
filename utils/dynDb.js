const AWS = require('aws-sdk')
const dynDb = new AWS.DynamoDB.DocumentClient()

module.exports = dynDb
