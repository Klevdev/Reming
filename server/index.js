/* eslint-disable no-console */
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const extendedResponse = require('./middleware/responses')
const authorize = require('./middleware/auth')
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

app.all('/test', authorize(false), (req, res) => {
  return res.sendData(200, { test: 'Test', user: req.user || 'not authorized' })
})

app.use(['/users', '/user'], require('./routes/users.route.js'))
app.use(['/materials', '/material'], require('./routes/materials.route.js'))

app.listen(process.env.PORT || 3000)
console.log(`Server is listening on http://localhost:${process.env.PORT || 3000}`)
