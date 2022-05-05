const extendedResponse = (req, res, next) => {
  res.sendError = (code, message, errors = []) => {
    const error = { error: { message } }
    if (errors && errors.length > 0)
      error.error.errors = errors
    return res.status(code).send(error)
  }

  res.sendData = (code, data = {}, message = undefined) => {
    const response = { data }
    if (message)
      data.message = message
    return res.status(code).send(response)
  }
  next()
}

module.exports = extendedResponse
