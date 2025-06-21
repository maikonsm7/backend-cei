const routes = require('express').Router()
const CourseController = require('../controllers/CourseController')
const verifyToken = require('../helpers/verify-token')

routes.post('/create', verifyToken, CourseController.create)
routes.patch('/update/:id', verifyToken, CourseController.update)
routes.get('/:id', verifyToken, CourseController.getById)
routes.get('/', verifyToken, CourseController.getAll)

module.exports = routes