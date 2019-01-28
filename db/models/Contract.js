const tableName = 'contract';

const foreignKeys = {
    application: 'applicationId',
    file: 'contractId',
};

module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define(tableName, {
        date: DataTypes.DATEONLY,
    }, {});

    Contract.associate = function (models) {
        Contract.belongsTo(models.application, {foreignKey: foreignKeys.application});
        Contract.hasMany(models.file, {
            foreignKey: foreignKeys.file,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
    };

    Contract.tableName = tableName;

    Contract.notUpdatableFields = [
        foreignKeys.application
    ];
    Contract.requiredFileds = [
        foreignKeys.application
    ];

    return Contract;
};
