const mongoose = require('mongoose')
const { nanoid } = require('nanoid')
const getContentModel = require('../utils/getMaterialModel')
const User = require('./user.model')

mongoose.connect(process.env.DB_URL)

const materialSchema = new mongoose.Schema({
  _id: {
    type: String,
    immutable: true,
    default: () => nanoid(10),
  },
  userId: {
    type: String,
    required: true,
    immutable: true,
    ref: 'Users',
  },
  contentId: {
    type: mongoose.Schema.ObjectId,
    immutable: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  type: {
    type: String,
    trim: true,
    required: true,
    immutable: true,
    enum: ['folder', 'glossary', 'cardSet', 'questionBank', 'test', 'article'],
  },
  description: {
    type: String,
    maxLength: 250,
  },
  createdAt: {
    type: Number,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
  tags: [String],
  privacy: {
    public: Boolean,
    access: {
      type: mongoose.Mixed,
      validate: {
        validator(v) {
          if (typeof v !== 'boolean' && typeof v !== 'object')
            return false
        },
      },
    },
  },
  avgRating: {
    type: Number,
    default: () => 0,
  },
  ratings: [Object],
  views: Number,
  __v: {
    type: Number,
    select: false,
  },
})

// materialSchema.virtual('user').get(async function() {
//   const user = await User.findById(this.userId)
//   return {
//     _id: user._id,
//     name: user.name,
//   }
// })

materialSchema.methods.getUserInfo = async function() {
  const user = await User.findById(this.userId)
  return {
    _id: user._id,
    name: user.name,
    picture: user.picture,
  }
}

materialSchema.methods.isSaved = async function(userId) {
  const user = await User.findById(userId)
  if (this.userId === userId || user?.savedMaterials.includes(this._id))
    return true
  return false
}

materialSchema.statics._create = async function(materialFull, userId) {
  const contentData = materialFull.content
  delete materialFull.content
  const type = materialFull.type
  const { _id } = await this.createContent(type, contentData)
  const materialData = {
    userId,
    contentId: _id,
    ...materialFull,
  }
  return await this.create(materialData)
}

materialSchema.methods._update = async function(materialFull) {
  const contentData = materialFull.content
  delete materialFull.content
  await this.updateContent(contentData)
  if (materialFull.title)
    this.title = materialFull.title
  if (materialFull.description)
    this.description = materialFull.description
  if (materialFull.tags)
    this.tags = materialFull.tags
  if (materialFull.privacy)
    this.privacy = materialFull.privacy
  await this.save()
}

materialSchema.methods.addRating = function(userId, score) {
  if (score < 1 || score > 5)
    return false
  const ratings = this.ratings
  for (let i = 0; i < ratings.length; i++) {
    if (ratings[i].userId === userId) {
      this.ratings.splice(i, 1)
      break
    }
  }
  // new rating avg = (R*N + r) / (N + 1)
  // R - previous rating avg, N - previous number of ratings, r - new rating
  this.avgRating = (this.avgRating * ratings.length + score) / (ratings.length + 1)
  this.ratings.push({ userId, score })
  return true
}

materialSchema.methods.project = async function(projection, userId) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  if (userId)
    obj.isSaved = await this.isSaved(userId)
  if (projection.includes('user'))
    obj.user = await this.getUserInfo()
  return obj
}

materialSchema.methods.short = async function(userId) {
  return await this.project(['_id', 'title', 'type', 'description', 'user'], userId)
}

materialSchema.methods.full = async function(userId) {
  return await this.project(['_id', 'title', 'type', 'user', 'description', 'createdAt', 'updatedAt', 'avgRating', 'views', 'tags'], userId)
}

materialSchema.statics.createContent = async function(type, content) {
  const model = getContentModel(type)
  const { _id } = await model._create(content)
  return _id
}

materialSchema.methods.getContent = async function() {
  const model = getContentModel(this.type)
  const doc = await model.findById(this.contentId)
  const content = await doc._get()
  return content
}

materialSchema.methods.updateContent = async function(content) {
  const model = getContentModel(this.type)
  const doc = await model.findById(this.contentId)
  await doc._update(content)
  await this.save()
}

materialSchema.statics.getPublic = async function(userId) {
  const materials = await this.find({ 'privacy.public': true })

  for (let i = 0; i < materials.length; i++)
    materials[i] = await materials[i].short(userId)

  return materials
}

materialSchema.statics.getPersonalMaterials = async function(userId) {
  const created = await this.find({ userId })
  const saved = await User.findById(userId).then(async user => await user.getSavedMaterials())
  const shared = await this.find({ 'privacy.access': userId })

  for (let i = 0; i < created.length; i++)
    created[i] = await created[i].short(userId)

  for (let i = 0; i < saved.length; i++)
    saved[i] = await saved[i].short(userId)

  for (let i = 0; i < shared.length; i++)
    shared[i] = await shared[i].short(userId)

  return {
    created,
    saved,
    shared,
  }
}

materialSchema.methods.checkAccess = function(userId) {
  if (this.userId === userId) // author can access its own material
    return true
  if (this.privacy.public === true) // user can access any public material
    return true
  if (this.privacy.access === true) // if material can be accessed via link by everyone
    return true
  if (this.privacy.access !== false && this.privacy.access.includes(userId)) // if material's access list includes user
    return true
  return false
}

materialSchema.pre('remove', async function(next) {
  const model = getContentModel(this.type)
  const content = await model.findById(this.contentId)
  await content.delete()

  const users = await User.find({ savedMaterials: this._id })
  users.forEach(async user => user.removeFromSavedMaterials(this._id))

  next()
})

module.exports = mongoose.model('Materials', materialSchema)
