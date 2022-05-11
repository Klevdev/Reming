const mongoose = require('mongoose')
const Definition = require('./definition.model.js')

mongoose.connect(process.env.DB_URL)

const glossarySchema = new mongoose.Schema({
  definitions: {
    type: {},
    of: mongoose.Schema.objectId,
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
})

glossarySchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

glossarySchema.statics._create = async function(definitionsObj) {
  const definitionsArr = definitionsObj.definitions
  const definitions = {}
  for (const idx in definitionsArr) {
    const definition = definitionsArr[idx]
    const { _id } = await Definition.create(definition)
    definitions[idx] = _id
  }

  return await this.create({ definitions })
}

glossarySchema.methods._update = async function(definitionsObj) {
  const definitionsNew = definitionsObj.definitions
  for (const idx in this.definitions) {
    if (!definitionsNew[idx])
      continue
    if (Object.keys(definitionsNew[idx]).length) // definitionsNew[idx] === {}
      await Definition.findByIdAndDelete(this.definitions[idx])
    const def = await Definition.findById(this.definitions[idx])
    await def._update(definitionsNew[idx])
  }
  await this.save()
}

glossarySchema.methods._get = async function() {
  const definitions = {}
  for (const idx in this.definitions) {
    const def = await Definition.findById(this.definitions[idx], { _id: 0 })
    definitions[idx] = def
  }
  return {
    definitions,
  }
}
// glossarySchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Glossaries', glossarySchema)
