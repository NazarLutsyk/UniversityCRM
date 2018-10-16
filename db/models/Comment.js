const tableName = 'comment';

const foreignKeys = {
    client: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(tableName, {
        text: DataTypes.STRING,
        date: DataTypes.DATE
    }, {});

    Comment.associate = function (models) {
        Comment.belongsTo(models.client, {foreignKey: foreignKeys.client});
    };

    Comment.tableName = tableName;

    return Comment;
};