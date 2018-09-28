module.exports = (sequelize, DataTypes) => {
    const ApplicationLesson = sequelize.define('application_lesson', {
    }, {});

    ApplicationLesson.associate = function (models) {
    };

    return ApplicationLesson;
};