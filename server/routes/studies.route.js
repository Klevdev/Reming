/* eslint-disable space-before-function-paren */
const express = require('express')
const sanitize = require('../middleware/sanitizeRequest')
const auth = require('../middleware/auth')
const Study = require('../models/study.model')

const router = express.Router()

router.use(auth(true))

router.post('/', async (req, res) => {
  try {
    const entry = {
      ...req.body,
      userId: req.user._id,
    }
    await Study.create(entry)
    return res.sendData(201)
  }
  catch (err) {
    return res.sendError(400, err.message, err.errors)
  }
})

router.delete('/:id', async (req, res) => {
})

module.exports = router