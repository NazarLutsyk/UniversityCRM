module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('task', {
        message: DataTypes.STRING,
        date: DataTypes.DATE
    }, {});

    Task.associate = function (models) {
        Task.belongsTo(models.client);
    };

    return Task;
};