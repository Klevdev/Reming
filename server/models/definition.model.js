const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

const definitionSchema = new mongoose.Schema({
  term: {
    txt: {
      type: String,
      required: true,
    },
    attachment: mongoose.ObjectId,
  },
  def: {
    txt: {
      type: String,
      required: true,
    },
    attachment: mongoose.ObjectId,
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
