const tableName = 'course';

const foreignKeys = {
    application: 'courseId',
    group: 'courseId',
    competitorApplication: 'courseId'
};

module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define(tableName, {
        name: DataTypes.STRING,
        fullPrice: DataTypes.INTEGER,
    }, {});

    Course.associate = function (models) {
        Course.hasMany(models.application, {foreignKey: foreignKeys.application});
        Course.hasMany(models.group, {foreignKey: foreignKeys.group});
        Course.hasMany(models.competitor_application, {foreignKey: foreignKeys.competitorApplication});
    };

    Course.tableName = tableName;

    Course.notUpdatableFields = [];
    Course.requiredFileds = ['name'];

    return Course;
};
