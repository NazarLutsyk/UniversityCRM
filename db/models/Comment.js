const tableName = 'comment';

const foreignKeys = {
    application: 'applicationId',
};

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(tableName, {
        text: DataTypes.STRING,
        date: DataTypes.DATE
    }, {});

    Comment.associate = function (models) {
        Comment.belongsTo(models.application, {foreignKey: foreignKeys.application});
    };

    Comment.tableName = tableName;

    return Comment;
};