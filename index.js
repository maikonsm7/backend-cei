require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))

// public folder for images
app.use(express.static('public'))

// db connect
const conn = require('./db/conn')

// models
const Role = require('./models/Role')
const User = require('./models/User')
const Student = require('./models/Student')
const Course = require('./models/Course')

// routes
const authRoutes = require('./routes/AuthRoutes')
const userRoutes = require('./routes/UserRoutes')
const studentRoutes = require('./routes/StudentRoutes')
const courseRoutes = require('./routes/CourseRoutes')

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/students', studentRoutes)
app.use('/courses', courseRoutes)

// conn.sync({force: true})
conn.sync()
    .then(app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    }))
    .catch(e => console.log(e))