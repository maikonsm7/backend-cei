const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-user-token')

class AuthController {
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
}

module.exports = AuthController