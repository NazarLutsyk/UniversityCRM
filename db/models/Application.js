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
        discount: DataTypes.STRING,
        leftToPay: DataTypes.INTEGER,
        hasPractice: DataTypes.TINYINT,
        wantPractice: DataTypes.TINYINT,
        certificate: DataTypes.STRING
    }, {});

    Application.associate = function (models) {
        Application.belongsTo(models.client, {
                foreignKey: {
                    field: foreignKeys.client,
                    allowNull: false
                }
            }
        );
        Application.belongsTo(models.course, {
            foreignKey: {
                field: foreignKeys.course,
                allowNull: false
            }
        });
        Application.belongsTo(models.group, {foreignKey: foreignKeys.group});
        Application.belongsTo(models.city, {
            foreignKey: {
                field: foreignKeys.city,
                allowNull: false
            }
        });
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

    Application.notUpdatableFields = [
        foreignKeys.client,
        foreignKeys.city,
        foreignKeys.course,
    ];
    Application.requiredFileds = [
        foreignKeys.client,
        foreignKeys.course,
        foreignKeys.city,
        'fullPrice',
        'date'
    ];

    return Application;
};
