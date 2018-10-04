const tableName = 'audio_call';

const foreignKeys = {
    application: 'applicationId',
};

module.exports = (sequelize, DataTypes) => {
    const AudioCall = sequelize.define(tableName, {
        date: DataTypes.DATE,
        comment: DataTypes.STRING,
        file: DataTypes.STRING,
    }, {});

    AudioCall.associate = function (models) {
        AudioCall.belongsTo(models.application, {foreignKey: foreignKeys.application});
    };

    AudioCall.tableName = tableName;

    return AudioCall;
};