const uuidv1 = require('uuid/v1')
const dynamoose = require('dynamoose')

const Schema = dynamoose.Schema
const dappsSchema = new Schema(
  {
    id: { type: String, hashKey: true, default: uuidv1() },
    host_name: { type: String, required: true, lowercase: true },
    domain_name: { type: String, required: true, lowercase: true },
    port: { type: Number },
    pubkey: { type: String, required: true },
    container_id: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Disable'] },
    expires: { type: Date },
  },
  {
    throughput: 5,
    timestamps: true,
    useDocumentTypes: true,
  }
)

module.exports = dappsSchema
