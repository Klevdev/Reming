/* eslint-disable space-before-function-paren */
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

async function auth(req, res, next) {
  const accessToken = req.cookies?.accessToken
  const refreshToken = req.cookies?.refreshToken

<<<<<<< HEAD
  let token
  if (accessToken) {
    try {
      token = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
=======
  let user
  if (accessToken) {
    try {
      user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
>>>>>>> origin/main
    }
    catch (err) {
      // console.log(err)
    }
  }
<<<<<<< HEAD
  if (token) {
    req.user = {
      _id: token._id,
    }
=======
  if (user) {
    req.user = user
>>>>>>> origin/main
    next()
    return
  }

  if (!refreshToken)
    return res.sendError(401, 'Refresh token is empty')

<<<<<<< HEAD
  try {
    token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  }
  catch (err) {
    return res.sendError(403, 'Refresh token is invalid or expired')
  }
  const _user = await User.findById(token._id)
  if (_user?.refreshToken !== refreshToken)
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
  next()
=======
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err)
      return res.sendError(403, 'Refresh token is invalid or expired')
    const _user = await User.findById(user._id)
    if (_user.refreshToken !== refreshToken)
      return res.sendError(403, 'Refresh token is invalid or expired')
    await _user.setRefreshToken()
    user.refreshed = true
    req.user = user
    next()
  })
>>>>>>> origin/main
}

module.exports = auth
