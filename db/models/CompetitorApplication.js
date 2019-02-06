const tableName = 'competitor_application';

const foreignKeys = {
    competitor: 'competitorId',
    client: 'clientId',
    course: 'courseId'
};


module.exports = (sequelize, DataTypes) => {
    const CompetitorApplication = sequelize.define(tableName, {
        date: DataTypes.DATEONLY
    }, {});

    CompetitorApplication.associate = function (models) {
        CompetitorApplication.belongsTo(models.client, {foreignKey: foreignKeys.client});
        CompetitorApplication.belongsTo(models.competitor, {foreignKey: foreignKeys.competitor});
        CompetitorApplication.belongsTo(models.course, {foreignKey: foreignKeys.course});
    };

    CompetitorApplication.tableName = tableName;

    CompetitorApplication.notUpdatableFields = [];
    CompetitorApplication.requiredFileds = [
        'date',
        foreignKeys.client,
        foreignKeys.competitor
    ];

    return CompetitorApplication;
};
