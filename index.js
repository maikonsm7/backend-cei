require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// solve cors
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// public folder for images
app.use(express.static('public'))

// db connect
const conn = require('./db/conn')

// models
const User = require('./models/User')

// routes
const userRoutes = require('./routes/UserRoutes')

app.use('/users', userRoutes)

conn.sync({force: true})
// conn.sync()
.then(app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
}))
.catch(e => console.log(e))