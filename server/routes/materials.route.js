/* eslint-disable space-before-function-paren */
const express = require('express')
const sanitize = require('../middleware/sanitizeRequest')
const auth = require('../middleware/auth')
const Material = require('../models/material.model')

const router = express.Router()

// router.get('/public', async (req, res) => {

// })

// router.get('/private', auth(), async (req, res) => {
  
// })

router.get('/:id/content', auth(false), async (req, res) => {
  const material = await Material.findById(req.params.id)
  if (!material)
    return res.sendError(404, 'Material not found')
  if (!material.checkAccess(req.user?._id))
    return res.sendError(403, 'Access denied')
  const content = await material.getContent()
  return res.sendData(200, content)
})

router.get('/:id', auth(false), async (req, res) => {
  const material = await Material.findById(req.params.id)
  if (!material)
    return res.sendError(404, 'Material not found')
  if (!material.checkAccess(req.user?._id))
    return res.sendError(403, 'Access denied')
  return res.sendData(200, material.full())
})

router.post('/', sanitize, auth(), async (req, res) => {
  try {
    const { _id } = await Material._create(req.body, req.user._id)
    return res.sendData(201, { _id })
  }
  catch (err) {
    return res.sendError(400, err.message, err.errors)
  }
})

router.patch('/:id/rate', sanitize, auth(), async (req, res) => {
  const material = await Material.findById(req.params.id)
  if (!material)
    return res.sendError(404, 'Material not found')
  if (!material.userId === req.user._id)
    return res.sendError(400, 'User cannot rate its own materials')
  if (!material.privacy.public)
    return res.sendError(400, 'Only public materials can be rated')
  if (!material.addRating(req.user._id, req.body.score))
    return res.sendError(400, 'Rating must be at range from 1 to 5')
  try {
    await material.save()
    return res.sendData(200)
  }
  catch (err) {
    return res.sendError(500, err.message, err.errors)
  }
})

// router.patch('/:id', auth(), async (req, res) => {
  
// })

// router.delete('/:id', auth(), async (req, res) => {
  
// })

module.exports = router
