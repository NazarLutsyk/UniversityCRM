const tableName = 'city_manager';

module.exports = (sequelize, DataTypes) => {
    const CityManager = sequelize.define(tableName, {
    }, {});

    CityManager.associate = function (models) {
    };

    CityManager.tableName = tableName;

    return CityManager;
};