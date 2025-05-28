const routes = require('express').Router()
const UserController = require('../controllers/UserController')
const verifyToken = require('../helpers/verify-token')

routes.post('/create', verifyToken, UserController.create)

module.exports = routes