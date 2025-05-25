const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Banco de dados conectado!')
} catch (error) {
    console.log(error)
}

module.exports = sequelize