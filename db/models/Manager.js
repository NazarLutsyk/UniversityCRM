const tableName = 'manager';

const foreignKeys = {
    city: 'managerId',
};

module.exports = (sequelize, DataTypes) => {
    const Manager = sequelize.define(tableName, {
        login: DataTypes.STRING,
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        role: DataTypes.STRING
    }, {});

    Manager.associate = function (models) {
        Manager.belongsToMany(models.city, {through: models.city_manager,foreignKey: foreignKeys.city});
    };

    Manager.tableName = tableName;

    return Manager;
};