const mongoose = require('mongoose')
const { nanoid } = require('nanoid')
const { saveFile, deleteFile } = require('../utils/files')

mongoose.connect(process.env.DB_URL)

const assetSchema = new mongoose.Schema({
  _id: {
    type: String,
    immutable: true,
    default: () => nanoid(10),
  },
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  type: {
    type: String,
    trim: true,
    required: true,
    immutable: true,
    enum: ['image'],
  },
  createdAt: {
    type: Number,
    immutable: true,
    default: () => Date.now(),
  },
  file: String,
  __tempFile: Object,
  __v: {
    type: Number,
    select: false,
  },
})

assetSchema.pre('save', async function(next) {
  if (!this.__tempFile)
    throw new Error('no file provided')
  this.file = saveFile(this.__tempFile)
  this.__tempFile = undefined
  next()
})

assetSchema.post('remove', function() {
  if (this.file)
    deleteFile(`.\\uploads\\${this.file}`)
})

module.exports = mongoose.model('Assets', assetSchema)
