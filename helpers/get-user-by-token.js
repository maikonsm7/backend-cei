const jwt = require('jsonwebtoken')
const User = require('../models/User')

const getUserByToken = async (token) => {
     if(!token){
            res.status(401).json({message: 'Acesso negado!'})
            return
        }
    const decoded = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ where: { id: decoded.id }, raw: true })
    return user
}

module.exports = getUserByToken