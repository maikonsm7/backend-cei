const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({ message: "Acesso negado!" })
        return
    }
    const token = getToken(req)
    if (!token) {
        res.status(401).json({ message: "Acesso negado!" })
        return
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({ message: "Token inválido ou expirado!" })
        return
    }
}

module.exports = checkToken