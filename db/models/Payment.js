const tableName = 'payment';

const foreignKeys = {
    application: 'applicationId',
    file: 'paymentId',
};

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(tableName, {
        number: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        amount: DataTypes.INTEGER,
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

    return Payment;
};