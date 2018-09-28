module.exports = (sequelize, DataTypes) => {
    const Source = sequelize.define('source', {
        name: DataTypes.STRING
    }, {});

    Source.associate = function (models) {
        Source.hasMany(models.application);
    };

    return Source;
};