const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.SECRET)
    res.status(200).json({message: "Você está autenticado!", token})
}

module.exports = createUserToken