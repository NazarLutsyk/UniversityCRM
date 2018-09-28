module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define('lesson', {
        topic: DataTypes.STRING
    }, {});

    Lesson.associate = function (models) {
        Lesson.belongsTo(models.group);
        Lesson.belongsToMany(models.application,{through: models.application_lesson});
    };

    return Lesson;
};