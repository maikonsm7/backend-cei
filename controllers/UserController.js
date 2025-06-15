const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

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

        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.SECRET)

        if (decoded.role !== 1) {
            res.status(422).json({ message: 'Usuário sem permissão!' })
            return
        }

        try {
            const newUser = await User.create({ name, email, RoleId: 2 })
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', newUser })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async edit(req, res) {
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

        await User.update({password: passwordHash}, {where: {id: user.id}})
        res.status(200).json({ message: 'Senha alterada com sucesso!' })

    }
}

module.exports = UserController