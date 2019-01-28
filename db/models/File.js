let fs = require('fs');
let path = require('path');

const tableName = 'file';

const foreignKeys = {
    client: 'clientId',
    audioCall: 'audio_callId',
    payment: 'paymentId',
    contract: 'contractId'
};


module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define(tableName, {
        path: DataTypes.STRING
    }, {
        hooks: {
            beforeDestroy: function (file) {
                return new Promise((resolve, reject) => {
                    fs.unlink(path.join(__dirname, '../../public', 'upload', file.path), (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        resolve();
                    });
                })
            }
        }
    });

    File.associate = function (models) {
        File.belongsTo(models.client, {
                foreignKey: foreignKeys.client,
                hooks: true
            }
        );
        File.belongsTo(models.audio_call, {
                foreignKey: foreignKeys.audioCall,
                hooks: true
            }
        );
        File.belongsTo(models.contract, {
                foreignKey: foreignKeys.contract,
                hooks: true
            }
        );
        File.belongsTo(models.payment, {
                foreignKey: foreignKeys.payment,
                hooks: true
            }
        );
    };

    File.tableName = tableName;

    File.notUpdatableFields = [
        'path',
        foreignKeys.client,
        foreignKeys.payment,
        foreignKeys.audioCall,
        foreignKeys.contract
    ];
    File.requiredFileds = [];

    return File;
};
