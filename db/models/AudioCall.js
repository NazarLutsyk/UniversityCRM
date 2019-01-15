const tableName = 'audio_call';

const foreignKeys = {
    application: 'clientId',
    file: 'audio_callId'
};

module.exports = (sequelize, DataTypes) => {
    const AudioCall = sequelize.define(tableName, {
        date: DataTypes.DATEONLY,
        comment: DataTypes.STRING,
    }, {});

    AudioCall.associate = function (models) {
        AudioCall.belongsTo(models.client, {
            foreignKey: foreignKeys.client,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        AudioCall.hasMany(models.file, {
            foreignKey: foreignKeys.file,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
    };

    AudioCall.tableName = tableName;

    return AudioCall;
};