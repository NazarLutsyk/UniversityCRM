module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('group', {
        name: DataTypes.STRING,
        startDate: DataTypes.DATEONLY,
        startTime: DataTypes.TIME,
    }, {});

    Group.associate = function (models) {
        Group.hasMany(models.application);
        Group.hasMany(models.lesson);
        Group.belongsTo(models.course);
    };
    
    return Group;
};