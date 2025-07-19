const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        role: user.RoleId,
        id: user.id
    }, process.env.SECRET, { expiresIn: '24h' })
    res.status(200).json({message: "Você está autenticado!", role: user.RoleId, token})
}

module.exports = createUserToken