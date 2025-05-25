const routes = require('express').Router()
const userController = require('../controllers/UserController')
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

routes.post('/register', userController.register)
routes.post('/login', userController.login)
routes.get('/checkuser', userController.checkUser)
routes.get('/:id', userController.getUserById)
routes.patch('/edit', verifyToken, imageUpload.single("image"), userController.editUser)
routes.get('/', userController.getAllUsers)

module.exports = routes