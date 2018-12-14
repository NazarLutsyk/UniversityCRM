const tableName = 'group';

const foreignKeys = {
    application: 'groupId',
    lesson: 'groupId',
    course: 'courseId',
    city: 'cityId',
};

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(tableName, {
        name: DataTypes.STRING,
        startDate: DataTypes.DATEONLY,
        startTime: DataTypes.TIME,
        countOfPractice: DataTypes.INTEGER
    }, {});

    Group.associate = function (models) {
        Group.hasMany(models.application, {foreignKey: foreignKeys.application});
        Group.hasMany(models.lesson, {foreignKey: foreignKeys.lesson});
        Group.belongsTo(models.course, {foreignKey: foreignKeys.course});
        Group.belongsTo(models.city, {foreignKey: foreignKeys.city});
    };

    Group.tableName = tableName;

    return Group;
};