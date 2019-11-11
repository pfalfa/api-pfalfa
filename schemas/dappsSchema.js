const uuidv1 = require('uuid/v1')
const dynamoose = require('dynamoose')

const Schema = dynamoose.Schema
const dappsSchema = new Schema(
  {
    id: { type: String, required: true, default: uuidv1() },
    domain: { type: String, required: true, lowercase: true },
    port: { type: Number },
    pubkey: { type: String, required: true },
    hash: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Disable'] },
    expires: { type: Date },
  },
  {
    throughput: 5,
    timestamps: true,
  }
)

module.exports = dappsSchema
