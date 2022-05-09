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

<<<<<<< HEAD
router.get('/refresh', async (req, res) => {
  const jwt = require('jsonwebtoken')
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken)
    return res.sendError(403, 'Refresh token is empty')

  let token
  try {
    token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  }
  catch (err) {
    return res.sendError(403, 'Refresh token is invalid or expired')
  }
  const _user = await User.findById(token._id)
  if (_user.refreshToken !== refreshToken)
    return res.sendError(403, 'Refresh token is invalid or expired')
  await _user.setRefreshToken()
  req.user = {
    _id: token._id,
    refreshed: true,
    refreshedTokens: {
      accessToken: _user.accessToken,
      refreshToken: _user.refreshToken,
    },
  }
  return res.sendData(200)
})

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
router.get('/:sid', async (req, res) => {
=======
router.get('/:sid', sanitizeRequest, async (req, res) => {
>>>>>>> origin/main
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
<<<<<<< HEAD
  return res.sendData(200)
=======
  return res.sendStatus(204)
>>>>>>> origin/main
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
