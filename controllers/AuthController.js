const User = require('../models/User')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

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

        const user = await User.findOne({ where: { email }, raw: true })
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
    static async recovery(req, res) {
        const email = req.body.email
        const user = await User.findOne({ where: { email }, raw: true })
        if (!user) {
            res.status(422).json({ message: "Email não cadastrado!" })
            return
        }

        let firstName = ""

        if(user.name.includes(" ")){
            firstName = user.name.substring(0, user.name.indexOf(" "))
        }else{
            firstName = user.name
        }

        const randomPass = firstName + `${Math.floor(Math.random() * (4000 - 1000) + 1000)}`
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(randomPass, salt)

        await User.update({password: passwordHash}, {where: {id: user.id}})

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Recuperação de senha",
            text: "Senha provisória",
            html: 'Olá ' + firstName + '!<br><br>Senha provisória: <b>' + randomPass + '</b>'
        }
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'E-mail enviado com sucesso!', to: user.email });
        } catch (error) {
            res.status(500).json({ error: 'Falha ao enviar e-mail.' });
        }
    }
}

module.exports = AuthController