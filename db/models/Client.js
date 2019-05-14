let _ = require('lodash');
let validators = require('../validators');

const tableName = 'client';

const foreignKeys = {
    task: 'clientId',
    application: 'clientId',
    comment: 'clientId',
    file: 'clientId',
    audioCall: 'clientId',
    social: 'clientId',
    competitorApplication: 'clientId',
    address: 'clientId',
    status: 'statusId'
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
        },
        statusId: {
            type: DataTypes.STRING
        }
    }, {});

    Client.associate = function (models) {
        Client.Tasks = Client.hasMany(models.task, {
            foreignKey: foreignKeys.task,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.Applications = Client.hasMany(models.application, {
            foreignKey: foreignKeys.application,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.Comments = Client.hasMany(models.comment, {
            foreignKey: foreignKeys.comment,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.AudioCalls = Client.hasMany(models.audio_call, {
            foreignKey: foreignKeys.audioCall,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.Files = Client.hasMany(models.file, {
            foreignKey: foreignKeys.file,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.Socials = Client.hasMany(models.social, {
            foreignKey: foreignKeys.social,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.CompetitorApplications = Client.hasMany(models.competitor_application, {
            foreignKey: foreignKeys.competitorApplication,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Client.Address = Client.hasOne(models.address, {
            foreignKey: foreignKeys.address,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            allowNull: false,
            hooks: true
        });
        Client.Status = Client.belongsTo(models.status, {
            foreignKey: {
                field: foreignKeys.status,
                allowNull: false
            }
        });
    };

    Client.tableName = tableName;

    Client.supersave = async function (client) {
        ['name', 'surname', 'phone', 'email'].forEach((value) => {
            if (typeof client[value] === 'string') {
                client[value] = client[value].trim();
            } else {
                client[value] = client[value];
            }
        });
        const include = [];
        if (_.has(client, 'address')) {
            include.push(Client.Address);
        }
        return await Client.create(client, {include});
    };

    Client.notUpdatableFields = [];
    Client.requiredFileds = ['name', 'surname'];

    return Client;
};
