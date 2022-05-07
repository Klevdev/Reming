const crypto = require('crypto')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid/async')
const { saveFile, deleteFile } = require('../utils/files')

mongoose.connect(process.env.DB_URL)

const userSchema = new mongoose.Schema({
  sid: String,
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
      },
      message: 'Invalid e-mail',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  refreshToken: String,
  createdAt: {
    type: Number,
    immutable: true,
    default: () => Date.now(),
  },
  lastLoginAt: {
    type: Number,
    default: () => Date.now(),
  },
  __tempPicture: Object,
  picture: String,
  bio: {
    type: String,
    maxLength: 250,
  },
  favorites: {
    type: Array,
    default: [],
  },
})

userSchema.virtual('accessToken').get(function() {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })
})

userSchema.methods.setRefreshToken = async function(save = true) {
  this.refreshToken = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN })
  this.lastLoginAt = Date.now()
  if (save)
    await this.save()
}

userSchema.statics.findByShortId = async function(sid, projection) {
  if (!projection)
    projection = { _id: 0, password: 0, sid: 0, refreshToken: 0 }
  const user = await this.findOne({ sid }, projection).exec()
  return user || false
}

const hashPassword = function(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('base64')
}

userSchema.methods.update = async function(userObject) {
  this.name = userObject.name || this.name
  this.email = userObject.email || this.email
  this.bio = userObject.bio || this.bio
  if (Object.prototype.hasOwnProperty.call(userObject, 'password'))
    this.password = hashPassword(userObject.password)

  this.__tempPicture = userObject.__tempPicture

  await this.save()
}

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({
    email,
    password: hashPassword(password),
  }).exec()
  if (!user)
    return false
  await user.setRefreshToken()
  return user
}

userSchema.methods.logout = async function() {
  this.refreshToken = null
  await this.save()
}

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    let safetyCounter = 0
    do
      this.sid = await nanoid(10)
    while (await this.model('Users').findOne({ sid: this.sid }) || safetyCounter++ >= 100)
    if (safetyCounter >= 100)
      throw new Error('Cannot create short id')
    this.password = hashPassword(this.password)
    this.setRefreshToken(false)
  }
  if (this.__tempPicture) {
    if (this.picture)
      deleteFile(this.picture)
    this.picture = saveFile(this.__tempPicture)
    this.__tempPicture = undefined
  }
  next()
})

userSchema.post('remove', function() {
  if (this.picture)
    deleteFile(this.picture)
})

module.exports = mongoose.model('Users', userSchema)
