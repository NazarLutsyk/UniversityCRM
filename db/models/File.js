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
    }, {});

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
        File.belongsTo(models.payment, {
                foreignKey: foreignKeys.payment,
                hooks: true
            }
        );
        File.belongsTo(models.contract, {
                foreignKey: foreignKeys.contract,
                hooks: true
            }
        );
    };

    File.addHook('beforeDestroy', (file, options) => {
        console.log('beforeDestroy');
        console.log(file);
        console.log(options);
    });

    File.addHook('beforeBulkDestroy', (file, options) => {
        console.log('beforeBulkDestroy');
        console.log(file);
        console.log(options);
    });

    File.tableName = tableName;

    return File;
};