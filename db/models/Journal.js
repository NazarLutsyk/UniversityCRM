const tableName = 'journal';

module.exports = (sequelize, DataTypes) => {
    const Journal = sequelize.define(tableName, {
    }, {});

    Journal.associate = function (models) {
    };

    Journal.tableName = tableName;

    return Journal;
};