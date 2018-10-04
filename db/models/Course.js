const tableName = 'course';

const foreignKeys = {
    application: 'courseId',
    group: 'courseId',
};

module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define(tableName, {
        name: DataTypes.STRING,
        fullPrice: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        resultPrice: DataTypes.INTEGER,
    }, {});

    Course.associate = function (models) {
        Course.hasMany(models.application, {foreignKey: foreignKeys.application});
        Course.hasMany(models.group, {foreignKey: foreignKeys.group});
    };

    Course.tableName = tableName;

    return Course;
};