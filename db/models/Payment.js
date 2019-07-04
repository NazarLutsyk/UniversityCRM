const tableName = 'payment';

const foreignKeys = {
    application: 'applicationId',
    file: 'paymentId',
    payment_status: 'paymentStatusId'
};

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(tableName, {
        number: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        expectedAmount: DataTypes.INTEGER,
        expectedDate: DataTypes.DATEONLY,
        paymentDate: DataTypes.DATEONLY,
        paymentStatusId: {
            type: DataTypes.STRING
        }
    }, {});

    Payment.associate = function (models) {
        Payment.belongsTo(models.application, {foreignKey: foreignKeys.application});
        Payment.hasMany(models.file, {
            foreignKey: foreignKeys.file,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Payment.PaymentStatus = Payment.belongsTo(models.payment_status, {
            foreignKey: {
                field: foreignKeys.payment_status,
                allowNull: false
            }
        });
    };



    Payment.tableName = tableName;

    Payment.notUpdatableFields = [
        foreignKeys.application
    ];
    Payment.requiredFileds = [
        'expectedDate',
        'expectedAmount',
        foreignKeys.application,
        foreignKeys.payment_status
    ];

    return Payment;
};
