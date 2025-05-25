const jwt = require('jsonwebtoken')
const User = require('../models/User')

const getUserByToken = async (token) => {
     if(!token){
            res.status(401).json({message: 'Acesso negado!'})
            return
        }
    const decoded = jwt.verify(token, "nosso_secret")
    const user = await User.findById(decoded.id)
    return user
}

module.exports = getUserByToken