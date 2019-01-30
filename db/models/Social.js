const tableName = 'social';

const foreignKeys = {
    client: 'clientId',
};


module.exports = (sequelize, DataTypes) => {
    const Social = sequelize.define(tableName, {
        url: DataTypes.STRING
    }, {});

    Social.associate = function (models) {
        Social.belongsTo(models.client, {foreignKey: foreignKeys.client});
    };

    Social.tableName = tableName;

    Social.notUpdatableFields = ['clientId'];
    Social.requiredFileds = [
        'url',
        'clientId'
    ];

    return Social;
};
