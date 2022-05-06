const sanitize = require('mongo-sanitize')

function sanitizeRequest(req, res, next) {
  req.body = sanitize(req.body)

  next()
}

module.exports = sanitizeRequest
