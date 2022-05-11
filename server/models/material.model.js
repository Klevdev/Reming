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

materialSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

materialSchema.virtual('user').get(async function() {
  const user = User.findById(this.userId)
  return {
    _id: user._id,
    name: user.name,
  }
})

materialSchema.methods.short = function() {
  return this.project(['_id', 'title', 'type'])
}

materialSchema.methods.full = function() {
  return this.project(['_id', 'title', 'type', 'description', 'createdAt', 'updatedAt', 'avgRating', 'views', 'tags'])
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

materialSchema.methods.checkAccess = function(userId) {
  if (this.userId === userId) // author can access its own material
    return true
  if (this.privacy.public === true) // user can access any public material
    return true
  if (this.privacy.access === true) // if material can be accessed via link by everyone
    return true
  if (this.privacy.access.includes(userId)) // if material's access list includes user
    return true
  return false
}

materialSchema.pre('remove', async function(next) {
  const model = getContentModel(this.type)
  const content = await model.findById(this.contentId)
  await content.delete()

  const users = await User.find({ favorites: this._id })
  users.forEach(async user => user.removeFromFavorites(this._id))

  next()
})

module.exports = mongoose.model('Materials', materialSchema)