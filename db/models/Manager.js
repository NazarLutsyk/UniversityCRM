const tableName = 'manager';

const foreignKeys = {
    city: 'cityId',
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
        Manager.belongsTo(models.city, {foreignKey: foreignKeys.city});
    };

    Manager.tableName = tableName;

    return Manager;
};