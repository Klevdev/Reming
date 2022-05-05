/* eslint-disable space-before-function-paren */
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

async function auth(req, res, next) {
  const accessToken = req.cookies?.accessToken
  const refreshToken = req.cookies?.refreshToken

  let user
  if (accessToken) {
    try {
      user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    }
    catch (err) {
      // console.log(err)
    }
  }
  if (user) {
    req.user = user
    next()
    return
  }

  if (!refreshToken)
    return res.sendError(403, 'Refresh token is empty')

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
}

module.exports = auth
