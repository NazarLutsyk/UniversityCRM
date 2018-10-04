const tableName = 'task';

const foreignKeys = {
    client: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define(tableName, {
        message: DataTypes.STRING,
        date: DataTypes.DATE
    }, {});

    Task.associate = function (models) {
        Task.belongsTo(models.client, {foreignKey: foreignKeys.client});
    };

    Task.tableName = tableName;

    return Task;
};