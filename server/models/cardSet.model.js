const mongoose = require('mongoose')
const Definition = require('./definition.model.js')

mongoose.connect(process.env.DB_URL)

const cardSetSchema = new mongoose.Schema({
  definitions: {
    type: {},
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
})

cardSetSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

cardSetSchema.statics._create = async function(definitionsObj) {
  const definitionsArr = definitionsObj.definitions
  const definitions = {}
  for (const idx in definitionsArr) {
    const definition = definitionsArr[idx]
    const { _id } = await Definition.create(definition)
    definitions[idx] = _id
  }

  return await this.create({ definitions })
}

cardSetSchema.methods._update = async function(update) {
  const definitionsUpdate = update.definitions
  // Update or delete definitions
  for (const idx in this.definitions) {
    if (definitionsUpdate[idx] === undefined)
      continue
    if (definitionsUpdate[idx] === false) {
      await Definition.findByIdAndDelete(this.definitions[idx])
      delete this.definitions[idx]
      continue
    }
    const def = await Definition.findById(this.definitions[idx])
    await def._update(definitionsUpdate[idx])
  }

  // Add new definitions
  for (const idx in definitionsUpdate) {
    if (Object.keys(this.definitions).includes(idx))
      continue
    if (definitionsUpdate[idx] === false)
      continue
    const { _id } = await Definition.create(definitionsUpdate[idx])
    this.definitions[idx] = _id
  }
  this.markModified('definitions')
  await this.save()
}

cardSetSchema.methods._get = async function() {
  const definitions = {}
  for (const idx in this.definitions) {
    const def = await Definition.findById(this.definitions[idx])
    definitions[idx] = def
  }
  return {
    definitions,
  }
}
cardSetSchema.pre('remove', async function(next) {
  for (const idx in this.definitions)
    await Definition.findByIdAndDelete(this.definitions[idx])

  next()
})

module.exports = mongoose.model('CardSets', cardSetSchema)
