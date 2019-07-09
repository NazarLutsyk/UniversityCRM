const tableName = 'payment_status';

const foreignKeys = {
    payment: 'paymentStatusId',
};

module.exports = (sequelize, DataTypes) => {
    const PaymentStatus = sequelize.define(tableName, {
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {});
    PaymentStatus.associate = function (models) {
        PaymentStatus.hasMany(models.payment, {foreignKey: foreignKeys.payment});
    };

    PaymentStatus.tableName = tableName;

    PaymentStatus.notUpdatableFields = [];
    PaymentStatus.requiredFileds = [
        'name'
    ];

    return PaymentStatus;
};
