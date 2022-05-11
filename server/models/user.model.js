const crypto = require('crypto')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const { saveFile, deleteFile } = require('../utils/files')
const Material = require('../models/material.model')

const hashPassword = function(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('base64')
}

mongoose.connect(process.env.DB_URL)

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    immutable: true,
    default: () => nanoid(10),
  },
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
    type: [String],
    default: [],
  },
  __v: {
    type: Number,
    select: false,
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

userSchema.methods.addToFavorites = async function(materialId) {
  if (this.favorites.includes(materialId))
    return false
  this.favorites.push(materialId)
  await this.save()
  return true
}

userSchema.methods.getFavorites = async function() {
  const materials = []
  for (let i = 0; i < this.favorites.length; i++) {
    const material = await Material.findById(this.favorites[i])
    if (!material)
      return false
    materials.push(material.short())
  }
  return materials
}

userSchema.methods.removeFromFavorites = async function(materialId) {
  for (let i = 0; i < this.favorites.length; i++) {
    if (this.favorites[i] === materialId)
      this.favorites.splice(i, 1)
  }
  await this.save()
  return true
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

userSchema.methods.project = function(projection) {
  const obj = {}
  for (let i = 0; i < projection.length; i++)
    obj[projection[i]] = this[projection[i]]
  return obj
}

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.password = hashPassword(this.password)
    this.setRefreshToken(false)
  }
  if (this.__tempPicture) {
    if (this.picture)
      deleteFile(`.\\uploads\\${this.picture}`)
    this.picture = saveFile(this.__tempPicture)
    this.__tempPicture = undefined
  }
  next()
})

userSchema.post('remove', function() {
  if (this.picture)
    deleteFile(`.\\uploads\\${this.picture}`)
})

module.exports = mongoose.model('Users', userSchema)
