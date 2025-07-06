const routes = require('express').Router()
const PaymentController = require('../controllers/PaymentController')
const verifyToken = require('../helpers/verify-token')

/* 
1 - Administrador
2 - Atendente
*/

routes.post('/create', verifyToken, PaymentController.create)
routes.patch('/update/:id', verifyToken, PaymentController.update)
routes.get('/students/:id', verifyToken, PaymentController.getAllPaymentsByStudent)
routes.get('/', verifyToken, PaymentController.getAllStudents)

module.exports = routes