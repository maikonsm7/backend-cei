const routes = require('express').Router()
const UserController = require('../controllers/UserController')
const verifyToken = require('../helpers/verify-token')
const accessRole = require('../helpers/access-role')

/* 
1 - Administrador
2 - Atendente
*/

routes.post('/create', verifyToken, accessRole(1), UserController.create)
routes.patch('/update', verifyToken, UserController.update)
routes.patch('/update/:id', verifyToken, accessRole(1), UserController.updateById)
routes.get('/:id', verifyToken, accessRole(1), UserController.getById)
routes.get('/', verifyToken, accessRole(1), UserController.getAll)

module.exports = routes