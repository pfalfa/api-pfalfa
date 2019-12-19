const uuidv1 = require('uuid/v1')
const dynamoose = require('dynamoose')

const Schema = dynamoose.Schema
const dappsSchema = new Schema(
  {
    id: { type: String, hashKey: true, default: uuidv1() },
    dappUid: { type: String, required: true },
    dappCreated: { type: Date, required: true },
    name: { type: String, required: true },
    port: { type: Number, required: true },
    pubkey: { type: String, required: true },
    IpPublic: { type: String, required: true },
    IpLocal: { type: String, required: true },
    category: { type: String },
    phase: { type: String },
    apiVersion: { type: String },
    description: { type: String },
    info: { type: Object },
    isDeleted: { type: Boolean, default: false },

    // isDeleted: { type: String, enum: ['Active', 'Inactive'] },
  },
  {
    throughput: 5,
    timestamps: true,
    useDocumentTypes: true,
  }
)

module.exports = dappsSchema
