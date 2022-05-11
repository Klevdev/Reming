const mongoose = require('mongoose')
const Definition = require('./definition.model.js')

mongoose.connect(process.env.DB_URL)

const glossarySchema = new mongoose.Schema({
  definitions: {
    type: Map,
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
  const definitionsArr = definitionsObj.definitions
  for (let i = 0; i < definitionsArr.length; i++)
    await Definition._update(definitionsArr[i])
  await this.save()
}

glossarySchema.statics._get = async function(id) {
  const glossary = await this.findById(id)
  const definitions = []
  for (let i = 0; i < glossary.definitions.length; i++) {
    const def = await Definition.findById(glossary.definitions[i])
    definitions.push(def)
  }
  return {
    definitions,
  }
}
// glossarySchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Glossaries', glossarySchema)
