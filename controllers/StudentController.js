const Student = require('../models/Student')
const Course = require('../models/Course')
const {Op} = require('sequelize')
const jwt = require('jsonwebtoken')

// helpers
const verifyCpf = require('../helpers/verify-cpf')
const getToken = require('../helpers/get-token')
const {validDate} = require('../helpers/valid-date')

class StudentController {
    static async create(req, res) {
        const { name, email, cpf, phone, birth, rg, gender, civilStatus, cep, street, number, neighborhood, city, state, complement, idCourse, modality, joinType, pole, stateCourse } = req.body
        const student = {cep, street, number, neighborhood, city, state, complement}
        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        student.name = name
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        student.email = email
        if (!cpf) {
            res.status(422).json({ message: 'O CPF é obrigatório!' })
            return
        }

        const cpfIsValid = verifyCpf(cpf)

        if (!cpfIsValid) {
            res.status(422).json({ message: 'CPF inválido!' })
            return
        }

        // check if CPF exist
        const checkCPF = await Student.findOne({ where: { cpf: cpfIsValid } })
        if (checkCPF) {
            res.status(422).json({ message: 'CPF já cadastrado!' })
            return
        }
        student.cpf = cpfIsValid

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }
        student.phone = phone
        if (!birth) {
            res.status(422).json({ message: 'A data de nascimento é obrigatória!' })
            return
        }
        if (!validDate(birth)) {
            res.status(422).json({ message: 'Data de nascimento inválida!' })
            return
        }
        student.birth = birth
        if (!rg) {
            res.status(422).json({ message: 'O RG é obrigatório!' })
            return
        }
        student.rg = rg
        if (!gender) {
            res.status(422).json({ message: 'O Gênero é obrigatório!' })
            return
        }
        student.gender = gender
        if (!civilStatus) {
            res.status(422).json({ message: 'O estado civil é obrigatório!' })
            return
        }
        student.civilStatus = civilStatus

        if (!idCourse) {
            res.status(422).json({ message: 'O curso é obrigatório!' })
            return
        }

        const course = await Course.findOne({where: {id: idCourse}})

        if (!course) {
            res.status(422).json({ message: 'Curso não encontrado!' })
            return
        }

        student.idCourse = idCourse

        if (!modality) {
            res.status(422).json({ message: 'A modalidade é obrigatória!' })
            return
        }
        student.modality = modality

        if (!joinType) {
            res.status(422).json({ message: 'O tipo de ingresso é obrigatório!' })
            return
        }
        student.joinType = joinType

        if (!pole) {
            res.status(422).json({ message: 'O pólo é obrigatório!' })
            return
        }
        student.pole = pole

        if (!stateCourse) {
            res.status(422).json({ message: 'O estado do curso é obrigatório!' })
            return
        }
        student.stateCourse = stateCourse

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            const newStudent = await Student.create({ ...student, createdUser: decoded.id })
            res.status(201).json({ message: 'Aluno cadastrado com sucesso!', newStudent })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async getAllStudents(req, res) {
        let search = req.query.search || ''
        try {
            const students = await Student.findAll({ order: [['name', 'ASC']], where: {name: {[Op.like]: `%${search}%`}}}) //DESC
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
    static async edit(req, res) {
        const id = req.params.id
        const { name, email, cpf, phone, birth, rg, gender, civilStatus, cep, street, number, neighborhood, city, state, complement, idCourse, modality, joinType, pole, stateCourse } = req.body
        const student = {cep, street, number, neighborhood, city, state, complement}

        // check if student exist
        const checkStudent = await Student.findOne({ where: { id }, raw: true })
        if (!checkStudent) {
            res.status(422).json({ message: 'Aluno não encontrado!' })
            return
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        student.name = name
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        student.email = email
        if (!cpf) {
            res.status(422).json({ message: 'O CPF é obrigatório!' })
            return
        }

        const cpfIsValid = verifyCpf(cpf)

        if (!cpfIsValid) {
            res.status(422).json({ message: 'CPF inválido!' })
            return
        }

        if (cpfIsValid !== checkStudent.cpf) {
            // check if CPF exist
            const checkCPF = await Student.findOne({ where: { cpf: cpfIsValid } })
            if (checkCPF) {
                res.status(422).json({ message: 'CPF já cadastrado!' })
                return
            }
        }
        student.cpf = cpfIsValid

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }
        student.phone = phone
        if (!birth) {
            res.status(422).json({ message: 'A data de nascimento é obrigatória!' })
            return
        }
        if (!validDate(birth)) {
            res.status(422).json({ message: 'Data de nascimento inválida!' })
            return
        }
        student.birth = birth
        if (!rg) {
            res.status(422).json({ message: 'O RG é obrigatório!' })
            return
        }
        student.rg = rg
        if (!gender) {
            res.status(422).json({ message: 'O Gênero é obrigatório!' })
            return
        }
        student.gender = gender
        if (!civilStatus) {
            res.status(422).json({ message: 'O estado civil é obrigatório!' })
            return
        }
        student.civilStatus = civilStatus

        if (!idCourse) {
            res.status(422).json({ message: 'O curso é obrigatório!' })
            return
        }

        const course = await Course.findOne({where: {id: idCourse}})

        if (!course) {
            res.status(422).json({ message: 'Curso não encontrado!' })
            return
        }

        student.idCourse = idCourse

        if (!modality) {
            res.status(422).json({ message: 'A modalidade é obrigatória!' })
            return
        }
        student.modality = modality

        if (!joinType) {
            res.status(422).json({ message: 'O tipo de ingresso é obrigatório!' })
            return
        }
        student.joinType = joinType

        if (!pole) {
            res.status(422).json({ message: 'O pólo é obrigatório!' })
            return
        }
        student.pole = pole

        if (!stateCourse) {
            res.status(422).json({ message: 'O estado do curso é obrigatório!' })
            return
        }
        student.stateCourse = stateCourse

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            await Student.update({ ...student, updatedUser: decoded.id }, { where: { id } })
            res.status(201).json({ message: 'Dados atualizados com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    
}

module.exports = StudentController