const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

class UserController {
    static async login(req, res) {
        const { email, password } = req.body

        // validations
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }

        const user = await User.findOne({ email })
        if (!user) {
            res.status(422).json({ message: "Email não cadastrado!" })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(422).json({ message: "Senha inválida!" })
            return
        }
        await createUserToken(user, req, res)
    }
    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findOne({ where: { id }, attributes: { exclude: ['pass'] } })
        if (user) {
            res.status(200).json({ user })
            return
        } else {
            res.status(422).json({ message: "Usuário não encontrado!" })
            return
        }
    }
}

module.exports = UserController