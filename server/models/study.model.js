const mongoose = require('mongoose')
const Material = require('../models/material.model')

mongoose.connect(process.env.DB_URL)

const studySchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  results: {
    type: Object,
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
})

studySchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

studySchema.statics.addEntry = async function(entry) {
  const existingLog = await this.find({ materialId: entry.materialId })
  if (existingLog?.length >= 1) {
    existingLog[0].results[Date.now()] = entry.results
    existingLog[0].markModified('results')
    await existingLog[0].save()
  } else {
    entry.results = {
      [Date.now()]: entry.results,
    }
    await this.create(entry)
  }
}

// studySchema.statics.getAll = async function(userId) {
//   const studies = await this.find({ userId })
//   studies.forEach((entry) => {
//     entry = {
//       ...entry,
//       materialInfo: await Material.findById(entry.materialId, { _id: 0 })
//     }
//   })
// }


// studySchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Studies', studySchema)
