/* eslint-disable space-before-function-paren */
const express = require('express')
const multer = require('multer')
const sanitize = require('../middleware/sanitizeRequest')
const auth = require('../middleware/auth')
const User = require('../models/user.model')
const { deleteFile } = require('../utils/files')

const upload = multer({ dest: './server/temp' })
const router = express.Router()

router.post('/signup', sanitize, async (req, res) => {
  try {
    const user = await User.create(req.body)
    const projection = ['name', 'picture', 'accessToken', 'refreshToken']
    return res.sendData(201, user.project(projection))
  }
  catch (err) {
    return res.sendError(400, err.message, err.errors)
  }
})

router.post('/login', sanitize, async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password)
    if (!user)
      return res.sendError(400, 'Incorrect e-mail or password')
    const projection = ['name', 'picture', 'accessToken', 'refreshToken']
    return res.sendData(201, user.project(projection))
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.get('/refresh', async (req, res) => {
  const jwt = require('jsonwebtoken')
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken)
    return res.sendError(401, 'Refresh token is empty')

  let token
  try {
    token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  }
  catch (err) {
    return res.sendError(401, 'Refresh token is invalid or expired')
  }
  const _user = await User.findById(token._id)
  if (_user.refreshToken !== refreshToken)
    return res.sendError(401, 'Refresh token is invalid or expired')
  await _user.setRefreshToken()

  const data = {
    accessToken: _user.accessToken,
    refreshToken: _user.refreshToken,
  }
  return res.sendData(200, data)
})

router.delete('/logout', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    await user.logout()
    return res.sendStatus(204)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.get('/self', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  return res.sendData(200, user.project(['name', 'email', 'bio', 'picture']))
})

router.patch('/self', sanitize, auth(true), upload.single('picture'), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const update = {
      ...req.body,
      __tempPicture: req.file,
    }
    await user.update(update)
  }
  catch (err) {
    if (req.file)
      deleteFile(req.file.path)
    return res.sendError(500, 'Error', err.errors)
  }
  if (user.picture)
    return res.sendData(200, { picture: user.picture })
  return res.sendData(200)
})

router.delete('/self', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    await user.delete()
    return res.sendStatus(204)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.patch('/favorites', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const added = await user.addToFavorites(req.body.materialId)
    if (!added)
      return res.sendError(404, 'Material not found')
    return res.sendData(200)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.get('/favorites', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const favorites = await user.getFavorites()
    return res.sendData(200, favorites)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.delete('/favorites', sanitize, auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    await user.removeFromFavorites(req.query.materialId)
    return res.sendData(200)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id, { _id: 0, password: 0, refreshToken: 0, __v: 0, favorites: 0 })
  if (!user)
    return res.sendError(404, 'User not found')
  return res.sendData(200, user)
})

module.exports = router
