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
    const projection = ['_id', 'name', 'picture', 'accessToken', 'refreshToken']
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
    const projection = ['_id', 'name', 'picture', 'accessToken', 'refreshToken']
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
  if (!_user || _user.refreshToken !== refreshToken)
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

router.patch('/picture', sanitize, auth(true), upload.single('picture'), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const update = {
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

router.patch('/self', sanitize, auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    await user.update(req.body)
  }
  catch (err) {
    return res.sendError(500, 'Error', err.errors)
  }
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

router.patch('/saved-materials', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  const material = await require('../models/material.model').findById(req.body.materialId)
  if (!material)
    return res.sendError(404, 'Material not found')
  try {
    const added = await user.addToSavedMaterials(req.body.materialId)
    if (!added)
      return res.sendError(400, 'Material is already in saved materials')
    return res.sendData(200)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.get('/saved-materials', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const favorites = await user.getSavedMaterials()
    return res.sendData(200, favorites)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.delete('/saved-materials', sanitize, auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    await user.removeFromSavedMaterials(req.query.materialId)
    return res.sendData(200)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.patch('/assets', auth(true), upload.single('file'), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const asset = {
      ...req.body,
      __tempFile: req.file,
    }
    await user.addAsset(asset)
  }
  catch (err) {
    if (req.file)
      deleteFile(req.file.path)
    return res.sendError(500, 'Error', err.errors)
  }
  return res.sendData(200)
})

router.get('/assets', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    const assets = await user.getAssets()
    return res.sendData(200, assets)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.delete('/assets', sanitize, auth(true), async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(401, 'User not found')
  try {
    await user.removeAsset(req.query.assetId)
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
