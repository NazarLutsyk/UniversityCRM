module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('client', {
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        passport: DataTypes.STRING
    }, {});

    Client.associate = function (models) {
        Client.hasMany(models.task);
        Client.hasMany(models.application);
    };

    return Client;
};