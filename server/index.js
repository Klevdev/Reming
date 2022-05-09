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

<<<<<<< HEAD
app.get('/test', (req, res) => {
<<<<<<< HEAD
  return res.sendError(400, 'Test')
  // return res.sendData(200)
=======
  return res.sendError(418, 'Test', [req.cookies])
>>>>>>> origin/main
=======
// app.use((req, res, next) => {
//   console.log(req.cookies)
//   next()
// })

app.post('/test', (req, res) => {
  // return res.sendError(418, 'Test')
  return res.sendData(200, { message: 'test' })
>>>>>>> development
})

/* - - - Routes: - - - */
app.use(['/users', '/user'], require('./routes/users.route.js'))

<<<<<<< HEAD
app.use((err, req, res) => {
  res.sendError(500, 'Server error. Try again', { err: err.message })
})

app.listen(process.env.PORT || 3000)
console.log(`Server is listening on http://localhost:${process.env.PORT || 3000}`)
<<<<<<< HEAD

=======
app.listen(process.env.PORT || 3000)
console.log(`Server is listening on http://localhost:${process.env.PORT || 3000}`)
>>>>>>> origin/main
=======
>>>>>>> development
