const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Student = db.define('Student', {
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    cpf: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    createdUser: {type: DataTypes.INTEGER, allowNull: false},
    updatedUser: {type: DataTypes.INTEGER},
})

module.exports = Student