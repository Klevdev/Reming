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
app.use(cors({
  origin: (_origin, callback) => {
    const whitelist = process.env.ORIGINS.split(' ')
    if (whitelist.includes(_origin) !== -1)
      callback(null, true)
    else
      callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// app.use((req, res, next) => {
//   console.log(req.cookies)
//   next()
// })

app.post('/test', (req, res) => {
  // return res.sendError(418, 'Test')
  return res.sendData(200, { message: 'test' })
})

/* - - - Routes: - - - */
app.use(['/users', '/user'], require('./routes/users.route.js'))

app.use((err, req, res) => {
  res.sendError(500, 'Server error. Try again', { err: err.message })
})

app.listen(process.env.PORT || 3000)
console.log(`Server is listening on http://localhost:${process.env.PORT || 3000}`)
