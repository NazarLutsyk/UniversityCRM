module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('payment', {
        number: DataTypes.STRING,
        date: DataTypes.DATE,
        amount: DataTypes.INTEGER,
        file: DataTypes.STRING,
    }, {});

    Payment.associate = function (models) {
        Payment.belongsTo(models.application);
    };

    return Payment;
};