const mongoose = require('mongoose')
const Definition = require('./definition.model.js')

mongoose.connect(process.env.DB_URL)

const glossarySchema = new mongoose.Schema({
  definitions: {
    type: [mongoose.ObjectId],
    required: true,
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
  const definitions = []
  for (let i = 0; i < definitionsArr.length; i++) {
    const definition = definitionsArr[i]
    const { _id } = await Definition.create(definition)
    definitions.push(_id)
  }

  return await this.create({ definitions })
}

// glossarySchema.pre('save', async function(next) {
//   next()
// })

module.exports = mongoose.model('Glossaries', glossarySchema)
