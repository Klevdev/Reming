/* eslint-disable space-before-function-paren */
const express = require('express')
const sanitizeRequest = require('../middleware/sanitizeRequest')
const auth = require('../middleware/auth')
const User = require('../models/user.model')

const router = express.Router()

router.post('/signup', sanitizeRequest, async (req, res) => {
  try {
    const user = await User.create(req.body)
    return res.sendData(201, { sid: user.sid, accessToken: user.accessToken })
  }
  catch (err) {
    return res.sendError(400, err.message, err.errors)
  }
})

router.post('/login', sanitizeRequest, async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password)
    if (!user)
      return res.sendError(400, 'Incorrect e-mail or password')
    return res.sendData(200, { sid: user.sid, accessToken: user.accessToken, refreshToken: user.refreshToken })
  }
  catch (err) {
    return res.sendError(400, err.message, err.errors)
  }
})

router.delete('/logout', auth, async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(400, 'User not found')
  try {
    await user.logout()
    return res.sendStatus(204)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

router.get('/:sid', sanitizeRequest, async (req, res) => {
  const user = await User.findByShortId(req.params.sid, { _id: 0, password: 0, sid: 0, refreshToken: 0 })
  if (!user)
    return res.sendError(400, 'User not found')
  return res.sendData(200, user)
})

router.patch('/self', sanitizeRequest, auth, async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(400, 'User not found')
  try {
    await user.update(req.body)
  }
  catch (err) {
    return res.sendError(500, 'Error', err.errors)
  }
  return res.sendStatus(204)
})

router.delete('/self', auth, async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user)
    return res.sendError(400, 'User not found')
  try {
    await user.delete()
    return res.sendStatus(204)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

module.exports = router
