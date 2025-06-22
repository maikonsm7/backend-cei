const bcrypt = require('bcrypt')

const randomPass = async (name) => {
    const firstName = name.includes(" ") ? name.substring(0, name.indexOf(" ")) : name
    const password = firstName + `${Math.floor(Math.random() * (4000 - 1000) + 1000)}`
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    return {password, passwordHash}
}

module.exports = randomPass