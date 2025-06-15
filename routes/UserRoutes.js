const routes = require('express').Router()
const UserController = require('../controllers/UserController')
const verifyToken = require('../helpers/verify-token')

routes.post('/create', verifyToken, UserController.create)
routes.patch('/edit', verifyToken, UserController.edit)

module.exports = routes