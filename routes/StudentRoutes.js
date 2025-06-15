const routes = require('express').Router()
const StudentController = require('../controllers/StudentController')
const verifyToken = require('../helpers/verify-token')

routes.post('/create', verifyToken, StudentController.create)
routes.patch('/edit/:id', verifyToken, StudentController.edit)
routes.get('/:id', verifyToken, StudentController.getStudentById)
routes.get('/', verifyToken, StudentController.getAllStudents)

module.exports = routes