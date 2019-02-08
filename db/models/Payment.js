const tableName = 'payment';

const foreignKeys = {
    application: 'applicationId',
    file: 'paymentId',
};

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(tableName, {
        number: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        expectedDate: DataTypes.DATEONLY,
        paymentDate: DataTypes.DATEONLY
    }, {});

    Payment.associate = function (models) {
        Payment.belongsTo(models.application, {foreignKey: foreignKeys.application});
        Payment.hasMany(models.file, {
            foreignKey: foreignKeys.file,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
    };

    Payment.tableName = tableName;

    Payment.notUpdatableFields = [
        foreignKeys.application
    ];
    Payment.requiredFileds = [
        'expectedDate',
        foreignKeys.application
    ];

    return Payment;
};
