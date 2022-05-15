const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

const definitionSchema = new mongoose.Schema({
  term: {
    text: {
      type: String,
      required: true,
    },
    attachment: mongoose.Schema.ObjectId,
  },
  def: {
    text: {
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

definitionSchema.methods._update = async function(definition) {
  this.term = definition.term
  this.def = definition.def

  await this.save()
}

// definitionSchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Definitions', definitionSchema)
