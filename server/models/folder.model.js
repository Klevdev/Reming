const mongoose = require('mongoose')
// const Material = require('./material.model.js')

mongoose.connect(process.env.DB_URL)

const folderSchema = new mongoose.Schema({
  materials: {
    type: [String],
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
})

folderSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

folderSchema.statics._create = async function(materials) {
  return await this.create({ materials })
}

// folderSchema.methods._update = async function(update) {
// }

folderSchema.methods._get = async function() {
  return this.materials
}

// folderSchema.pre('remove', async function(next) {
// })

module.exports = mongoose.model('Folders', folderSchema)
