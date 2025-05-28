const User = require('../models/User')
const jwt = require('jsonwebtoken')

// helpers
const getToken = require('../helpers/get-token')

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

        if(decoded.role !== 1){
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
}

module.exports = UserController