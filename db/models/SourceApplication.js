const tableName = 'source_application';

module.exports = (sequelize, DataTypes) => {
    const SourceApplication = sequelize.define(tableName, {
    }, {});

    SourceApplication.associate = function (models) {
    };

    SourceApplication.tableName = tableName;

    return SourceApplication;
};