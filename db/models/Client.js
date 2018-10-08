const tableName = 'client';

const foreignKeys = {
    task: 'clientId',
    application: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define(tableName, {
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        passport: DataTypes.STRING
    }, {});

    Client.associate = function (models) {
        Client.hasMany(models.task, {foreignKey: foreignKeys.task,});
        Client.hasMany(models.application, {foreignKey: foreignKeys.application});
    };

    Client.tableName = tableName;

    return Client;
};