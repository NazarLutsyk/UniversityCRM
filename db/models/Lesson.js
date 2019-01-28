    const tableName = 'lesson';

const foreignKeys = {
    group: 'groupId',
    journal: 'lessonId',
};

module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define(tableName, {
        topic: DataTypes.STRING,
        main: DataTypes.TINYINT,
    }, {});

    Lesson.associate = function (models) {
        Lesson.belongsTo(models.group, {foreignKey: foreignKeys.group});
        Lesson.belongsToMany(models.application, {through: models.journal, foreignKey: foreignKeys.journal});
    };

    Lesson.tableName = tableName;

    Lesson.notUpdatableFields = [
        foreignKeys.group
    ];
    Lesson.requiredFileds = [
        'topic',
        'main',
        foreignKeys.group
    ];

    return Lesson;
};
