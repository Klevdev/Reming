/* eslint-disable no-console */
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const extendedResponse = require('./middleware/responses')
const app = express()

require('dotenv').config({ path: path.join(__dirname, '.env') })

app.use(express.json())
app.use(cookieParser())
app.use(extendedResponse)
app.use(cors({ origin: 'http://localhost:3333' }))

app.get('/test', (req, res) => {
  return res.sendError(400, 'Test')
  // return res.sendData(200)
})

/* - - - Routes: - - - */
app.use(['/users', '/user'], require('./routes/users.route.js'))

app.use((err, req, res) => {
  res.sendError(500, 'Server error. Try again', { err: err.message })
})

app.listen(process.env.PORT || 3000)
console.log(`Server is listening on http://localhost:${process.env.PORT || 3000}`)

