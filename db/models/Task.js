const tableName = 'task';

const foreignKeys = {
    client: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define(tableName, {
        message: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        done: DataTypes.TINYINT,
    }, {});

    Task.associate = function (models) {
        Task.belongsTo(models.client, {foreignKey: foreignKeys.client});
    };

    Task.tableName = tableName;

    Task.notUpdatableFields = [
        foreignKeys.client
    ];
    Task.requiredFileds = [
        foreignKeys.client,
        'message'
    ];

    return Task;
};
