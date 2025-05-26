const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Role = db.define('Role', {
    name: {type: DataTypes.STRING, allowNull: false},
})

module.exports = Role