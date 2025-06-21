const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Course = db.define('Course', {
    name: {type: DataTypes.STRING, allowNull: false},
    createdUser: {type: DataTypes.INTEGER},
    updatedUser: {type: DataTypes.INTEGER},
})

module.exports = Course