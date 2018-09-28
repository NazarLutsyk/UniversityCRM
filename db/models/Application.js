module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('application', {
        date: DataTypes.DATE,
        fullPrice: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        resultPrice: DataTypes.INTEGER,
        leftToPay: DataTypes.INTEGER,
    }, {});

    Application.associate = function (models) {
        Application.belongsTo(models.client);
        Application.belongsTo(models.source);
        Application.belongsTo(models.course);
        Application.belongsTo(models.group);
        Application.hasOne(models.contract);
        Application.hasMany(models.comment);
        Application.hasMany(models.audio_call);
        Application.hasMany(models.payment);
        Application.belongsToMany(models.lesson,{through: models.application_lesson});
    };

    return Application;
};