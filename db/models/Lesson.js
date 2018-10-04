const tableName = 'lesson';

const foreignKeys = {
    group: 'groupId',
    journal: 'lessonId',
    homework: 'lessonId',
};

module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define(tableName, {
        topic: DataTypes.STRING
    }, {});

    Lesson.associate = function (models) {
        Lesson.belongsTo(models.group, {foreignKey: foreignKeys.group});
        Lesson.belongsToMany(models.application, {through: models.journal, foreignKey: foreignKeys.journal});
        Lesson.belongsToMany(models.application, {through: models.homework, foreignKey: foreignKeys.homework});
    };

    Lesson.tableName = tableName;

    return Lesson;
};