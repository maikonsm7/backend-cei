const routes = require('express').Router()
const StudentController = require('../controllers/StudentController')
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

// routes.post('/register', StudentController.register)
routes.post('/create', verifyToken, StudentController.create)
// routes.get('/:id', StudentController.getUserById)
// routes.patch('/edit', verifyToken, imageUpload.single("image"), StudentController.editUser)
routes.get('/', verifyToken, StudentController.getAllStudents)

module.exports = routes