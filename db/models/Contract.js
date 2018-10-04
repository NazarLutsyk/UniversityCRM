const tableName = 'contract';

const foreignKeys = {
    application: 'applicationId',
};

module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define(tableName,{
        date: DataTypes.DATE,
        file: DataTypes.STRING
    },{});

    Contract.associate = function (models){
        Contract.belongsTo(models.application, {foreignKey: foreignKeys.application});
    };

    Contract.tableName = tableName;

    return Contract;
};