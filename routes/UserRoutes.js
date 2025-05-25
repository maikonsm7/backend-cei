const routes = require('express').Router()
const UserController = require('../controllers/UserController')
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

// routes.post('/register', UserController.register)
routes.post('/login', UserController.login)
routes.get('/:id', UserController.getUserById)
// routes.patch('/edit', verifyToken, imageUpload.single("image"), UserController.editUser)
// routes.get('/', UserController.getAllUsers)

module.exports = routes