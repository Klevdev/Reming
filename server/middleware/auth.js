/* eslint-disable space-before-function-paren */
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

async function _authStrict(req, res, next) {
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
    return next()
  }

  if (!refreshToken)
    return res.sendError(401, 'Отсутствует токен')

  try {
    token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  }
  catch (err) {
    return res.sendError(401, 'Токен некорректен или истёк')
  }
  const _user = await User.findById(token._id)
  if (_user?.refreshToken !== refreshToken)
    return res.sendError(401, 'Токен некорректен или истёк')
  await _user.setRefreshToken()
  req.user = {
    _id: token._id,
    refreshed: true,
    refreshedTokens: {
      accessToken: _user.accessToken,
      refreshToken: _user.refreshToken,
    },
  }
  return next()
}
async function _authNonStrict(req, res, next) {
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
    return next()
  }

  if (!refreshToken)
    return next()

  try {
    token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  }
  catch (err) {
    return next()
  }
  const _user = await User.findById(token._id)
  if (_user?.refreshToken !== refreshToken)
    return next()
  await _user.setRefreshToken()
  req.user = {
    _id: token._id,
    refreshed: true,
    refreshedTokens: {
      accessToken: _user.accessToken,
      refreshToken: _user.refreshToken,
    },
  }
  return next()
}

function authorize(strict = true) {
  return strict ? _authStrict : _authNonStrict
}

module.exports = authorize
