const Student = require('../models/Student')
const jwt = require('jsonwebtoken')

// helpers
const verifyCpf = require('../helpers/verify-cpf')
const getToken = require('../helpers/get-token')

class StudentController {
    static async create(req, res) {
        const { name, email, cpf, phone } = req.body

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        if (!cpf) {
            res.status(422).json({ message: 'O CPF é obrigatório!' })
            return
        }

        const cpfIsValid = verifyCpf(cpf)

        if (!cpfIsValid) {
            res.status(422).json({ message: 'CPF inválido!' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            const newStudent = await Student.create({ name, email, cpf, phone, createdUser: decoded.id })
            res.status(201).json({ message: 'Aluno cadastrado com sucesso!', newStudent })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async getAllStudents(req, res) {
        try {
            const students = await Student.findAll({ order: [['createdAt', 'DESC']] })
            res.status(201).json({ students })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getStudentById(req, res) {
        const id = req.params.id
        try {
            const student = await Student.findOne({ where: { id }, raw: true })
            if (student) {
                res.status(200).json({ student })
                return
            } else {
                res.status(422).json({ message: "Aluno não encontrado!" })
                return
            }
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
}

module.exports = StudentController