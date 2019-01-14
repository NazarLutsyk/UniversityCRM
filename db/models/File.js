const tableName = 'file';

const foreignKeys = {};


module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define(tableName, {
        path: DataTypes.STRING
    }, {});

    File.associate = function (models) {
    };

    File.tableName = tableName;

    return File;
};