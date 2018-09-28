module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
        text: DataTypes.STRING,
        date: DataTypes.DATE
    }, {});

    Comment.associate = function (models){
        Comment.belongsTo(models.application);
    };

    return Comment;
};