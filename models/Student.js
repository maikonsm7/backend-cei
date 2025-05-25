const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Student = db.define('Student', {
    name: {type: DataTypes.STRING, require: true},
    email: {type: DataTypes.STRING, require: true},
    cpf: {type: DataTypes.STRING, require: true},
    phone: {type: DataTypes.STRING, require: true},
    createdUser: {type: DataTypes.INTEGER, require: true},
    updatedUser: {type: DataTypes.INTEGER},
})

module.exports = Student