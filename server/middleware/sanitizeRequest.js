const sanitize = require('mongo-sanitize')

function sanitizeRequest(req, res, next) {
<<<<<<< HEAD
=======
  req.params = sanitize(req.params)
  req.query = sanitize(req.query)
>>>>>>> origin/main
  req.body = sanitize(req.body)

  next()
}

module.exports = sanitizeRequest
