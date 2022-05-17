const mongoose = require('mongoose')

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
  studiedAt: {
    type: Number,
    immutable: true,
    default: () => Date.now(),
  },
  results: {
    type: [Object],
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

// studySchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Studies', studySchema)
