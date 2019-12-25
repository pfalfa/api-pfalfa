const uuidv1 = require('uuid/v1')
const dynamoose = require('dynamoose')

const Schema = dynamoose.Schema
const dappsSchema = new Schema(
  {
    id: { type: String, hashKey: true, default: uuidv1() },
    dappUid: { type: String, required: true },
    dappCreated: { type: Date, required: true },
    dappDetail: { type: Object },
    logoUrl: { type: String },
    name: { type: String, required: true },
    port: { type: Number },
    pubkey: { type: String, required: true },
    ipPublic: { type: String },
    ipLocal: { type: String },
    category: { type: String },
    status: { type: String },
    apiVersion: { type: String },
    description: { type: String },
    ipfsHash: { type: String },
    gunDb: { type: String, required: true },
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
