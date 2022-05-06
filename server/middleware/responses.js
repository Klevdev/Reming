const extendedResponse = (req, res, next) => {
  res.sendError = (code, message, errors) => {
    if (!message)
      throw new Error('Error response must have a message')
    if (typeof message !== 'string')
      throw new Error('"message" parameter must be string')
    if (errors && typeof errors !== 'object')
      throw new Error('"errors" parameter must be object, array or undefined')

    const response = {
      error: { message },
    }
    if (errors && Object.keys(errors).length > 0)
      response.error.errors = errors
    if (req.user?.refreshed)
      response.tokens = req.user.refreshedTokens

    return res.status(code).send(response)
  }

  res.sendData = (code, data) => {
    if (data && typeof data !== 'object')
      throw new Error('"data" parameter must be object, array or undefined')
    if (code.toString() === '204')
      throw new Error('Trying to send data with code 204. Use "sendStatus(204)" instead')

    const response = {}
    if (data && Object.keys(data).length > 0)
      response.data = data
    // if (message)
    //   data.message = message
    console.log("user: ", req.user);
    if (req.user?.refreshed)
      response.tokens = req.user.refreshedTokens

    if (Object.keys(response).length > 0)
      return res.status(code).send(response)
    else
      return res.sendStatus(code)
  }
  next()
}

module.exports = extendedResponse
