const tableName = 'source';

const foreignKeys = {
    application: 'sourceId',
};

module.exports = (sequelize, DataTypes) => {
    const Source = sequelize.define(tableName, {
        name: DataTypes.STRING
    }, {});

    Source.associate = function (models) {
        Source.hasMany(models.application, {foreignKey: foreignKeys.source});
    };

    Source.tableName = tableName;

    return Source;
};