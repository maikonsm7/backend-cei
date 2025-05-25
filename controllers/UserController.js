const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatório!' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatório!' })
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas estão divergentes!' })
            return
        }

        // check if user exists
        const existsUser = await User.findOne({ email })
        if (existsUser) {
            res.status(422).json({ message: 'Email já cadastrado!' })
            return
        }

        // encrypt pass
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar usuário!' })
            return
        }
    }
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
    static async checkUser(req, res) {
        let currentUser
        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, "nosso_secret")
            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }
    static async getAllUsers(req, res) {
        const users = await User.find().lean()
        res.status(200).json({ users })
    }
    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findById(id).select("-password")
        if (user) {
            res.status(200).json({ user })
            return
        } else {
            res.status(422).json({ message: "Usuário não encontrado!" })
            return
        }
    }
    static async editUser(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(req.file){
            user.image = req.file.filename
        }

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        user.name = name


        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }

        const userExists = await User.findOne({ email })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Email já está em uso!' })
            return
        }
        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }
        user.phone = phone

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas estão divergentes!' })
            return
        } else if (password === confirmpassword && password != null) {
            // encrypt pass
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }

        try {
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                {new: true}
            )
            res.status(200).json({message: "Dados atualizados com sucesso!"})
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = UserController