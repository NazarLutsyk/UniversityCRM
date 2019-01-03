const tableName = 'city';

const foreignKeys = {
    manager: 'cityId',
    application: 'cityId',
    group: 'cityId'
};


module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define(tableName, {
        name: DataTypes.STRING
    }, {});

    City.associate = function (models) {
        City.hasMany(models.application, {foreignKey: foreignKeys.application});
        City.hasMany(models.group, {foreignKey: foreignKeys.group});
        City.belongsToMany(models.manager, {through: models.city_manager,foreignKey: foreignKeys.manager});
    };

    City.tableName = tableName;

    return City;
};