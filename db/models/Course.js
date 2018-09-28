module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('course', {
        name: DataTypes.STRING,
        fullPrice: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        resultPrice: DataTypes.INTEGER,
    }, {});

    Course.associate = function (models) {
        Course.hasMany(models.application);
        Course.hasMany(models.group);
    };

    return Course;
};