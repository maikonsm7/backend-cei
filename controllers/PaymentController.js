const Payment = require('../models/Payment')
const Student = require('../models/Student')
const jwt = require('jsonwebtoken')

// helpers
const getToken = require('../helpers/get-token')
const { validDate } = require('../helpers/valid-date')

class PaymentController {

    static async create(req, res) {
        const { expirationDate, paymentDate, paymentAmount, observation, StudentId } = req.body
        let status = 'Pendente'

        // validations
        if (!expirationDate) {
            res.status(422).json({ message: 'A data de vencimento é obrigatória!' })
            return
        }
        if (!validDate(expirationDate)) {
            res.status(422).json({ message: 'Data de vencimento inválida!' })
            return
        }
        if (paymentDate) {
            if (!validDate(paymentDate)) {
                res.status(422).json({ message: 'Data de pagamento inválida!' })
                return
            }
            status = 'Pago'
        }
        if (!paymentAmount) {
            res.status(422).json({ message: 'O valor da mensalidade é obrigatório!' })
            return
        }
        if (!StudentId) {
            res.status(422).json({ message: 'Selecione algum(a) aluno(a)!' })
            return
        }

        const studentExist = await Student.findOne({ where: { id: StudentId } })

        if (!studentExist) {
            res.status(422).json({ message: 'Aluno não existe!' })
            return
        }

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            const newPayment = await Payment.create({ expirationDate, paymentDate, paymentAmount, status, observation, StudentId, createdUser: decoded.id })
            res.status(201).json({ message: 'Lançamento efetuado com sucesso!', newPayment })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async update(req, res) {
        const { expirationDate, paymentDate, paymentAmount, observation } = req.body
        const id = req.params.id
        let status = 'Pendente'

        // check if payment exist
        const checkPayment = await Payment.findOne({ where: { id }, raw: true })
        if (!checkPayment) {
            res.status(422).json({ message: 'Lançamento não encontrado!' })
            return
        }

        // validations
        if (!expirationDate) {
            res.status(422).json({ message: 'A data de vencimento é obrigatória!' })
            return
        }
        if (!validDate(expirationDate)) {
            res.status(422).json({ message: 'Data de vencimento inválida!' })
            return
        }
        if (paymentDate) {
            if (!validDate(paymentDate)) {
                res.status(422).json({ message: 'Data de pagamento inválida!' })
                return
            }
            status = 'Pago'
        }
        if (!paymentAmount) {
            res.status(422).json({ message: 'O valor da mensalidade é obrigatório!' })
            return
        }

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        try {
            await Payment.update({ expirationDate, paymentDate, paymentAmount, status, observation, updatedUser: decoded.id }, { where: { id } })
            res.status(201).json({ message: 'Lançamento atualizado com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async getById(req, res) {
        const id = req.params.id
        try {
            const payment = await Payment.findOne({ where: { id }, raw: true })
            if (!payment) {
                res.status(422).json({ message: "Lançamento não encontrado!" })
                return
            }
            res.status(200).json({ payment })

        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async getAllStudents(req, res) {
        try {
            const students = await Student.findAll({ raw: true, order: [['name', 'ASC']], attributes: ['id', 'name', 'email', 'phone'] })
            const paymentsPending = await Payment.findAll({ where: { status: 'Pendente' }, raw: true })
            const idStudents = paymentsPending.map(p => p.StudentId)

            const paymentStudents = students.map(student => {
                if (idStudents.includes(student.id)) {
                    student.status = 'Pendente'
                } else {
                    student.status = 'Pago'
                }
                return student
            })
            res.status(201).json({ paymentStudents })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getStudentsList(req, res) {
        try {
            const students = await Student.findAll({ raw: true, order: [['name', 'ASC']], attributes: ['id', 'name'] })
            res.status(201).json({ students })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getAllPaymentsByStudent(req, res) {
        const id = req.params.id
        // check if student exist
        const checkStudent = await Student.findOne({ where: { id }, raw: true })
        if (!checkStudent) {
            res.status(422).json({ message: 'Aluno não encontrado!' })
            return
        }

        try {
            const paymentsByStudent = await Payment.findAll({ where: { StudentId: id }, order: [['createdAt', 'DESC']], raw: true })
            res.status(201).json({ student: checkStudent.name, paymentsByStudent })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }


}

module.exports = PaymentController