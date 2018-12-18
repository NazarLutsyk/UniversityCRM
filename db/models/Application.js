const tableName = 'application';

const foreignKeys = {
    client: 'clientId',
    source: 'sourceId',
    course: 'courseId',
    group: 'groupId',
    contract: 'applicationId',
    audioCall: 'applicationId',
    payment: 'applicationId',
    journal: 'applicationId',
    city: 'cityId',
};


module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define(tableName, {
        date: DataTypes.DATEONLY,
        fullPrice: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        resultPrice: DataTypes.INTEGER,
        leftToPay: DataTypes.INTEGER,
        hasPractice: DataTypes.TINYINT,
        wantPractice: DataTypes.TINYINT,
    }, {});

    Application.associate = function (models) {
        Application.belongsTo(models.client, {foreignKey: foreignKeys.client});
        Application.belongsTo(models.source, {foreignKey: foreignKeys.source});
        Application.belongsTo(models.course, {foreignKey: foreignKeys.course});
        Application.belongsTo(models.group, {foreignKey: foreignKeys.group});
        Application.belongsTo(models.city, {foreignKey: foreignKeys.city});
        Application.hasOne(models.contract, {foreignKey: foreignKeys.contract});
        Application.hasMany(models.audio_call, {foreignKey: foreignKeys.audioCall});
        Application.hasMany(models.payment, {foreignKey: foreignKeys.payment});
        Application.belongsToMany(models.lesson, {through: models.journal, foreignKey: foreignKeys.journal});
    };

    Application.tableName = tableName;

    return Application;
};