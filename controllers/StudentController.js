const Student = require('../models/Student')
const verifyCpf = require('../helpers/verify-cpf')

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

        const newStudent = await Student.create({ name, email, cpf, phone, createdUser: req.session.userid })
        res.status(201).json({ message: 'Aluno cadastrado com sucesso!', newStudent })
        return

    }
    static async getAllStudents(req, res) {
        const studentsData = await Student.findAll({
            order: [['createdAt', 'DESC']]
        })

        res.status(201).json({ studentsData })
        return
    }
}

module.exports = StudentController