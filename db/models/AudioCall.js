const tableName = 'audio_call';

const foreignKeys = {
    application: 'applicationId',
    file: 'audio_callId'
};

module.exports = (sequelize, DataTypes) => {
    const AudioCall = sequelize.define(tableName, {
        date: DataTypes.DATEONLY,
        comment: DataTypes.STRING,
    }, {});

    AudioCall.associate = function (models) {
        AudioCall.belongsTo(models.application, {foreignKey: foreignKeys.application});
        AudioCall.hasMany(models.file, {foreignKey: foreignKeys.file});
    };

    AudioCall.tableName = tableName;

    return AudioCall;
};