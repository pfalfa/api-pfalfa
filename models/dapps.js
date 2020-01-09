const AWS = require('aws-sdk')
const table = 'pfalfa-dapps-staging'

async function post(payload = {}, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient()
  const params = { TableName: table, Item: payload }
  ddb.put(params, callback)
}

async function get(payload = {}, exp = '', att = {}, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient()
  const params = { TableName: table, Key: payload }
  if (exp !== '') params.ConditionExpression = exp
  if (att !== {}) params.ExpressionAttributeValues = att
  ddb.get(params, callback)
}

async function scan(payload = {}, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient()
  const params = { TableName: table, Key: payload }
  ddb.scan(params, callback)
}

async function put(payload = {}, exp = '', att = {}, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient()
  const params = { TableName: table, Key: payload, UpdateExpression: exp, ExpressionAttributeValues: att, ReturnValues: 'UPDATED_NEW' }
  ddb.update(params, callback)
}

async function del(payload = {}, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient()
  const params = { TableName: table, Key: payload }
  ddb.delete(params, callback)
}

module.exports = Dapps = { post, scan, get, put, del }
