const mongoose = require('mongoose')
const Material = require('../models/material.model')

mongoose.connect(process.env.DB_URL)

const studySchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true,
  },
  materialInfo: Object,
  userId: {
    type: String,
    required: true,
  },
  resultsCount: Number,
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
  const existingLog = await this.find({ materialId: entry.materialId, userId: entry.userId })
  if (existingLog?.length >= 1) {
    existingLog[0].results[Date.now()] = entry.results
    existingLog[0].markModified('results')
    await existingLog[0].save()
  }
  else {
    entry.results = {
      [Date.now()]: entry.results,
    }
    await this.create(entry)
  }
}

studySchema.statics.getAll = async function(userId) {
  const studies = await this.find({ userId })
  for (let i = 0; i < studies.length; i++) {
    const materialInfo = await Material.findById(studies[i].materialId, { _id: 0 })
    studies[i].materialInfo = materialInfo
  }

  return studies
}

// studySchema.statics.getOne = async function(userId, materialId) {
//   const studies = await this.find({ userId, materialId })
//   for (let i = 0; i < studies.length; i++) {
//     const materialInfo = await Material.findById(studies[i].materialId, { _id: 0 })
//     studies[i].materialInfo = materialInfo
//   }

//   return studies
// }

studySchema.statics.getMaterialEntries = async function(userId, materialId) {
  const studies = await this.find({ materialId, userId })
  const materialInfo = await Material.findById(studies[0].materialId, { _id: 0 })
  studies[0].materialInfo = materialInfo

  return studies
}

// studySchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Studies', studySchema)
