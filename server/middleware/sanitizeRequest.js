const sanitize = require('mongo-sanitize')

function sanitizeRequest(req, res, next) {
  req.params = sanitize(req.params)
  req.query = sanitize(req.query)
  req.body = sanitize(req.body)

  next()
}

module.exports = sanitizeRequest
