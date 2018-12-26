const tableName = 'source';

const foreignKeys = {
    application: 'sourceId',
};

module.exports = (sequelize, DataTypes) => {
    const Source = sequelize.define(tableName, {
        name: DataTypes.STRING
    }, {});

    Source.associate = function (models) {
        Source.belongsToMany(models.application, {through: models.source_application, foreignKey: foreignKeys.application});

    };

    Source.tableName = tableName;

    return Source;
};