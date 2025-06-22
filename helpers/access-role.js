const accessRole = (role) => {
    return function (req, res, next) {
        if (req.user.role !== role) {
            res.status(401).json({ message: "Usuário sem permissão!" })
            return
        }
        next()
    }
}

module.exports = accessRole