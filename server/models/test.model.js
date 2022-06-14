const mongoose = require('mongoose')
const Question = require('./question.model.js')

mongoose.connect(process.env.DB_URL)

const testSchema = new mongoose.Schema({
  questions: {
    type: {},
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
})

testSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

testSchema.statics._create = async function(questionsObj) {
  const questionsArr = questionsObj.questions
  const questions = {}
  for (const idx in questionsArr) {
    const question = questionsArr[idx]
    const { _id } = await Question.create(question)
    questions[idx] = _id
  }

  return await this.create({ questions })
}

testSchema.methods._update = async function(update) {
  const questionsUpdate = update.questions
  // Update or delete questions
  for (const idx in this.questions) {
    if (questionsUpdate[idx] === undefined)
      continue
    if (questionsUpdate[idx] === false) {
      await Question.findByIdAndDelete(this.questions[idx])
      delete this.questions[idx]
      continue
    }
    const def = await Question.findById(this.questions[idx])
    await def._update(questionsUpdate[idx])
  }

  // Add new questions
  for (const idx in questionsUpdate) {
    if (Object.keys(this.questions).includes(idx))
      continue
    if (questionsUpdate[idx] === false)
      continue
    const { _id } = await Question.create(questionsUpdate[idx])
    this.questions[idx] = _id
  }
  this.markModified('questions')
  await this.save()
}

testSchema.methods._get = async function() {
  const questions = {}
  for (const idx in this.questions) {
    const def = await Question.findById(this.questions[idx])
    questions[idx] = def
  }
  return {
    questions,
  }
}
testSchema.pre('remove', async function(next) {
  for (const idx in this.questions)
    await Question.findByIdAndDelete(this.questions[idx])

  next()
})

module.exports = mongoose.model('Tests', testSchema)
