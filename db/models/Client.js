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

    Client.buildJoins = function (includes) {
        let res = [];
        for (let include of includes) {
            include = include.toLowerCase();
            switch (include) {
                case 'tasks' : {
                    res.push({
                        table: 'tasks',
                        localKey: 'client.id',
                        foreignKey: 'tasks.clientId'
                    });
                    break;
                }
                case 'applications' : {
                    res.push({
                        table: 'applications',
                        localKey: 'client.id',
                        foreignKey: 'applications.clientId'
                    });
                    break;
                }
            }
        }
        return res;
    };

    Client.tableName = tableName;

    return Client;
};