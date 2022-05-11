const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

const definitionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    select: false,
  },
  term: {
    txt: {
      type: String,
      required: true,
    },
    attachment: mongoose.Schema.ObjectId,
  },
  def: {
    txt: {
      type: String,
      required: true,
    },
    attachment: mongoose.Schema.ObjectId,
  },
  __v: {
    type: Number,
    select: false,
  },
})

definitionSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

// definitionSchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Definitions', definitionSchema)
