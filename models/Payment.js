const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const Student = require('./Student')

const Payment = db.define('Payment', {
    expirationDate: {type: DataTypes.STRING, allowNull: false},
    paymentDate: {type: DataTypes.STRING},
    paymentAmount: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    status: {type: DataTypes.STRING, allowNull: false},
    observation: {type: DataTypes.STRING},
    createdUser: {type: DataTypes.INTEGER},
    updatedUser: {type: DataTypes.INTEGER},
})

// cada pagamento pertence à 1 aluno
// 1 aluno pode ter vários pagamentos
Payment.belongsTo(Student)
Student.hasMany(Payment)

module.exports = Payment