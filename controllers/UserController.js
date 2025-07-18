const User = require('../models/User')
const bcrypt = require('bcrypt')
const {Op} = require('sequelize')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const randomPass = require('../helpers/random-pass')
const sendEmail = require('../helpers/send-email')

class UserController {
    static async create(req, res) {
        const { name, email } = req.body

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }

        const emailExist = await User.findOne({ where: {email} })

        if (emailExist) {
            res.status(422).json({ message: 'Email já cadastrado!' })
            return
        }

        const { password, passwordHash } = await randomPass(name)

        const mailOptions = {
            to: email,
            subject: "Novo usuário cadastrado",
            text: "Senha provisória",
            html: 'Cadastro realizado com sucesso. Bem vindo!<br><br>Senha provisória: <b>' + password + '</b>'
        }

        try {
            const newUser = await User.create({ name, email, password: passwordHash, active: true, RoleId: 2 })
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', newUser })
            await sendEmail(mailOptions)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async update(req, res) {
        const { currentpass, newpass } = req.body
        // validations
        if (!currentpass) {
            res.status(422).json({ message: 'A senha atual é obrigatória!' })
            return
        }
        if (!newpass) {
            res.status(422).json({ message: 'A senha nova é obrigatória!' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        const passwordMatch = await bcrypt.compare(currentpass, user.password)

        if (!passwordMatch) {
            res.status(422).json({ message: 'Senha atual inválida!' })
            return
        }

        if (currentpass === newpass) {
            res.status(422).json({ message: 'Cadastre uma senha diferente da atual!' })
            return
        }

        if (newpass.length < 6) {
            res.status(422).json({ message: 'A nova senha deve ter no mínimo 6 caracteres!' })
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(newpass, salt)

        await User.update({ password: passwordHash }, { where: { id: user.id } })
        res.status(200).json({ message: 'Senha alterada com sucesso!' })

    }
    static async updateById(req, res) {
        const { name, email, active } = req.body
        console.log(active)
        const { id } = req.params

        if(req.user.id == id){
            res.status(422).json({ message: 'Selecione outro usuário!' })
            return
        }

        const userExist = await User.findOne({ where: {id} })

        // validations
        if (!userExist) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }

        if(email !== userExist.email){
            const emailExist = await User.findOne({ where: {email} })
            if (emailExist) {
                res.status(422).json({ message: 'Email já cadastrado!' })
                return
            }
        }

        if ( typeof active !== 'boolean') {
            res.status(422).json({ message: 'Valor inválido para ativo/inativo!' })
            return
        }

        await User.update({ name, email, active }, { where: { id } })
        res.status(200).json({ message: 'Dados alterados com sucesso!' })

    }
    static async getAll(req, res) {
        try {
            const users = await User.findAll({ where:{id: {[Op.ne]: req.user.id}, RoleId: 2}, order: [['name', 'ASC']] }) //DESC
            res.status(201).json({ users })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getById(req, res) {
        const {id} = req.params
        if(req.user.id == id){
            res.status(422).json({ message: 'Selecione outro usuário!' })
            return
        }
        try {
            const user = await User.findOne({ where:{id}, attributes: { exclude: ['password']}})
            res.status(201).json({ user })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}

module.exports = UserController