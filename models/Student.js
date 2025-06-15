const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Student = db.define('Student', {
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    cpf: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    birth: {type: DataTypes.STRING, allowNull: false},
    rg: {type: DataTypes.STRING, allowNull: false},
    gender: {type: DataTypes.STRING, allowNull: false},
    civilStatus: {type: DataTypes.STRING, allowNull: false},
    cep: {type: DataTypes.STRING},
    street: {type: DataTypes.STRING},
    number: {type: DataTypes.STRING},
    neighborhood: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING},
    state: {type: DataTypes.STRING},
    complement: {type: DataTypes.STRING},
    createdUser: {type: DataTypes.INTEGER},
    updatedUser: {type: DataTypes.INTEGER},
})

module.exports = Student