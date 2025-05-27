const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const Role = require('./Role')

const User = db.define('User', {
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING}
})

User.belongsTo(Role)
Role.hasMany(User)

module.exports = User