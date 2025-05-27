const routes = require('express').Router()
const AuthController = require('../controllers/AuthController')

// routes.post('/register', AuthController.register)
routes.post('/login', AuthController.login)
routes.post('/recovery', AuthController.recovery)
// routes.patch('/edit', verifyToken, imageUpload.single("image"), AuthController.editUser)
// routes.get('/', AuthController.getAllUsers)

module.exports = routes