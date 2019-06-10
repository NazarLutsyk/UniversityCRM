const tableName = 'status';

const foreignKeys = {
    client: 'statusId',
};

module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define(tableName, {
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        description: DataTypes.STRING
    }, {});
    Status.associate = function (models) {
        Status.hasMany(models.client, {foreignKey: foreignKeys.client});
    };

    Status.tableName = tableName;

    Status.notUpdatableFields = [];
    Status.requiredFileds = [
        'name',
        'color',
        'description'
    ];

    return Status;
};
