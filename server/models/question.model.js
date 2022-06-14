const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple', 'tf', 'write', 'match'],
  },
  question: {
    text: String,
    asset: {
      type: mongoose.Mixed,
      required: false,
    },
  },
  answer: {
    type: mongoose.Mixed,
    required: true,
  },
  options: Array,
  __v: {
    type: Number,
    select: false,
  },
})

questionSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

// questionSchema.methods._update = async function(question) {
//   await this.save()
// }

// questionSchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Questions', questionSchema)
