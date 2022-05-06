/* eslint-disable space-before-function-paren */
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

async function auth(req, res, next) {
  const accessToken = req.cookies?.accessToken
  const refreshToken = req.cookies?.refreshToken

  let token
  if (accessToken) {
    try {
      token = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    }
    catch (err) {
      // console.log(err)
    }
  }
  if (token) {
    req.user = {
      _id: token._id,
    }
    next()
    return
  }

  if (!refreshToken)
    return res.sendError(403, 'Refresh token is empty')

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
  next()
}

module.exports = auth
