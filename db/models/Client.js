let validators = require('../validators');

const tableName = 'client';

const foreignKeys = {
    task: 'clientId',
    application: 'clientId',
    comment: 'clientId',
    file: 'clientId',
    audioCall: 'clientId',
    social: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define(tableName, {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                hasLetters: validators.hasLetters,
            }
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                hasLetters: validators.hasLetters,
            }
        },
        phone: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING
        }
    }, {});

    Client.associate = function (models) {
        Client.hasMany(models.task, {
            foreignKey: foreignKeys.task,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.hasMany(models.application, {
            foreignKey: foreignKeys.application,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.hasMany(models.comment, {
            foreignKey: foreignKeys.comment,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.hasMany(models.audio_call, {
            foreignKey: foreignKeys.audioCall,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.hasMany(models.file, {
            foreignKey: foreignKeys.file,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.hasMany(models.social, {
            foreignKey: foreignKeys.social,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
    };

    Client.tableName = tableName;

    Client.supersave = async function (client) {
        ['name', 'surname', 'phone', 'email'].forEach((value) => {
            if (client[value]) {
                client[value] = client[value].trim();
            }
        });
        return await Client.create(client);
    };

    Client.notUpdatableFields = [];
    Client.requiredFileds = ['name', 'surname'];

    return Client;
};
