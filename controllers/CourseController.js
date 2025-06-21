const Course = require('../models/Course')
const jwt = require('jsonwebtoken')

// helpers
const getToken = require('../helpers/get-token')

class CourseController {
    static async create(req, res) {
        const { name } = req.body
        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            const newCourse = await Course.create({ name, createdUser: decoded.id })
            res.status(201).json({ message: 'Curso cadastrado com sucesso!', newCourse })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async getAll(req, res) {
        try {
            const courses = await Course.findAll({ order: [['name', 'ASC']]}) //DESC
            res.status(201).json({ courses })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getById(req, res) {
        const id = req.params.id
        try {
            const course = await Course.findOne({ where: { id }, raw: true })
            if (course) {
                res.status(200).json({ course })
                return
            } else {
                res.status(422).json({ message: "Curso não encontrado!" })
                return
            }
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async update(req, res) {
        const id = req.params.id
        const { name } = req.body

        // check if course exist
        const checkCourse = await Course.findOne({ where: { id }, raw: true })
        if (!checkCourse) {
            res.status(422).json({ message: 'Curso não encontrado!' })
            return
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            await Course.update({ name, updatedUser: decoded.id }, { where: { id } })
            res.status(201).json({ message: 'Dados atualizados com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    
}

module.exports = CourseController