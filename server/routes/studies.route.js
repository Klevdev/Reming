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
    await Study.addEntry(entry)
    return res.sendData(201)
  }
  catch (err) {
    return res.sendError(400, err.message, err.errors)
  }
})

router.get('/', async (req, res) => {
  const studies = await Study.getAll(req.user._id)

  return res.sendData(200, studies)
})

// router.get('/:materialId', async (req, res) => {
//   const study = await Study.getOne(req.user._id, req.params.materialId)

//   return res.sendData(200, study)
// })

router.delete('/:materialId', async (req, res) => {
  const study = await Study.findOne({userId: req.user._id, materialId: req.params.materialId})
  if (!study) {
    return res.sendError(404, 'Записей не найдено')
  }
  await study.delete()
  return res.sendData(200)
})

module.exports = router
