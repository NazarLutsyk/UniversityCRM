const tableName = 'competitor';

const foreignKeys = {
    competitorApplication: 'competitorId',
};

module.exports = (sequelize, DataTypes) => {
    const Competitor = sequelize.define(tableName, {
        name: DataTypes.STRING
    }, {});

    Competitor.associate = function (models) {
        Competitor.hasMany(models.competitor_application, {
            foreignKey: foreignKeys.competitorApplication,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });

    };

    Competitor.tableName = tableName;

    Competitor.notUpdatableFields = [];
    Competitor.requiredFileds = ['name'];

    return Competitor;
};
