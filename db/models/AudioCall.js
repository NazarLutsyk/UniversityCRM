module.exports = (sequelize, DataTypes) => {
    const AudioCall = sequelize.define('audio_call', {
        date: DataTypes.DATE,
        comment: DataTypes.STRING,
        file: DataTypes.STRING,
    }, {});

    AudioCall.associate = function (models) {
        AudioCall.belongsTo(models.application);
    };

    return AudioCall;
};