const User = require('../models/User')
const bcrypt = require('bcrypt')

// helpers
const createUserToken = require('../helpers/create-user-token')
const sendEmail = require('../helpers/send-email')
const randomPass = require('../helpers/random-pass')

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

        const user = await User.findOne({ where: { email }, raw: true })
        if (!user) {
            res.status(422).json({ message: "Email não cadastrado!" })
            return
        }
        if (!user.active) {
            res.status(422).json({ message: "Usuário inativo!" })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(422).json({ message: "Senha inválida!" })
            return
        }
        await createUserToken(user, req, res)
    }
    static async recovery(req, res) {
        const email = req.body.email
        // validations
        if (!email) {
            res.status(422).json({ message: "O email é obrigatório!" })
            return
        }

        const user = await User.findOne({ where: { email }, raw: true })
        if (!user) {
            res.status(422).json({ message: "Email não cadastrado!" })
            return
        }
        if (user.active === false) {
            res.status(422).json({ message: "Usuário inativo!" })
            return
        }

        const {password, passwordHash} = await randomPass(user.name)
        await User.update({password: passwordHash}, {where: {id: user.id}})

        const mailOptions = {
            to: user.email,
            subject: "Recuperação de senha",
            text: "Senha provisória",
            html: 'Olá!<br><br>Senha provisória: <b>' + password + '</b>'
        }

        try {
            await sendEmail(mailOptions)
            res.status(200).json({ message: 'E-mail enviado com sucesso!', to: user.email })
        } catch (error) {
            res.status(500).json({ error: 'Falha ao enviar e-mail.' })
        }
    }
}

module.exports = AuthController