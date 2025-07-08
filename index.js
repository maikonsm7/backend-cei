require('dotenv').config()
const express = require('express')
const rateLimit = require('express-rate-limit')
//const fs = require('fs')
const cors = require('cors')
const https = require('https')
const app = express()
const port = process.env.PORT || 3001

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // por IP a cada 15 minutos
}))

/* const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/itacoatiaracei.com.br/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/itacoatiaracei.com.br/fullchain.pem')
} */

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
//app.use(cors({ credentials: true, origin: ['https://itacoatiaracei.com.br', 'https://www.itacoatiaracei.com.br'] }))

// public folder for images
app.use(express.static('public'))

// db connect
const conn = require('./db/conn')

// models
const Role = require('./models/Role')
const User = require('./models/User')
const Student = require('./models/Student')
const Course = require('./models/Course')
const Payment = require('./models/Payment')

// routes
const authRoutes = require('./routes/AuthRoutes')
const userRoutes = require('./routes/UserRoutes')
const studentRoutes = require('./routes/StudentRoutes')
const courseRoutes = require('./routes/CourseRoutes')
const paymentRoutes = require('./routes/PaymentRoutes')

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/students', studentRoutes)
app.use('/courses', courseRoutes)
app.use('/payments', paymentRoutes)

// conn.sync({force: true})
conn.sync()
    .then(app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    }))
    /* .then(()=>{https.createServer(sslOptions, app).listen(port, () => {
        console.log(`http://localhost:${port}`)
    })}) */
    .catch(e => console.log(e))