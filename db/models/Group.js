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
        expirationDate: DataTypes.DATEONLY,
        startTime: DataTypes.TIME,
        freePractice: DataTypes.INTEGER,
        usedPractice: DataTypes.INTEGER,
        teacher: DataTypes.STRING,
    }, {});

    Group.associate = function (models) {
        Group.hasMany(models.application, {foreignKey: foreignKeys.application});
        Group.hasMany(models.lesson, {
            foreignKey: foreignKeys.lesson,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            hooks: true
        });
        Group.belongsTo(models.course, {foreignKey: foreignKeys.course});
        Group.belongsTo(models.city, {foreignKey: foreignKeys.city});
    };

    Group.tableName = tableName;

    Group.notUpdatableFields = [
        foreignKeys.city,
        foreignKeys.course,
        'usedPractice'
    ];
    Group.requiredFileds = [
        'name',
        'startDate',
        'startTime',
        'expirationDate',
        foreignKeys.city,
        foreignKeys.course
    ];

    return Group;
};
