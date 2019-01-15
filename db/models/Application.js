const tableName = 'application';

const foreignKeys = {
    client: 'clientId',
    source: 'applicationId',
    course: 'courseId',
    group: 'groupId',
    contract: 'applicationId',
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
        Application.belongsTo(models.client, {
                foreignKey: foreignKeys.client,
                onDelete: 'cascade',
                onUpdate: 'cascade',
                hooks: true
            }
        );
        Application.belongsTo(models.course, {foreignKey: foreignKeys.course});
        Application.belongsTo(models.group, {foreignKey: foreignKeys.group});
        Application.belongsTo(models.city, {foreignKey: foreignKeys.city});
        Application.hasOne(models.contract, {
            foreignKey: foreignKeys.contract,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Application.hasMany(models.payment, {
            foreignKey: foreignKeys.payment,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Application.belongsToMany(models.lesson, {
            through: models.journal,
            foreignKey: foreignKeys.journal,
            hooks: true
        });
        Application.belongsToMany(models.source, {
            through: models.source_application,
            foreignKey: foreignKeys.source,
            hooks: true
        });
    };

    Application.tableName = tableName;

    return Application;
};