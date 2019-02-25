const tableName = 'address';

const foreignKeys = {
    client: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define(tableName, {
        address: DataTypes.STRING,
        ltg: DataTypes.DOUBLE,
        lng: DataTypes.DOUBLE
    }, {});

    Address.associate = function (models) {
        Address.belongsTo(models.client, {foreignKey: {name: foreignKeys.client, allowNull: false}});
    };

    Address.tableName = tableName;

    Address.notUpdatableFields = [];
    Address.requiredFileds = [];

    return Address;
};
