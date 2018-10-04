const tableName = 'group';

const foreignKeys = {
    application: 'groupId',
    lesson: 'groupId',
    course: 'courseId',
};

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(tableName, {
        name: DataTypes.STRING,
        startDate: DataTypes.DATEONLY,
        startTime: DataTypes.TIME,
    }, {});

    Group.associate = function (models) {
        Group.hasMany(models.application, {foreignKey: foreignKeys.application});
        Group.hasMany(models.lesson, {foreignKey: foreignKeys.lesson});
        Group.belongsTo(models.course, {foreignKey: foreignKeys.course});
    };

    Group.tableName = tableName;

    return Group;
};