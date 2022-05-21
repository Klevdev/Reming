const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

const cardsSetSchema = new mongoose.Schema({
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

cardsSetSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

cardsSetSchema.methods._update = async function(definition) {
  this.term = definition.term
  this.def = definition.def

  await this.save()
}

// cardsSetSchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('CardsSets', cardsSetSchema)
