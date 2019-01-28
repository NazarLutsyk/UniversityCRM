const tableName = 'comment';

const foreignKeys = {
    client: 'clientId',
};

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(tableName, {
        text: DataTypes.STRING,
        date: DataTypes.DATEONLY
    }, {});

    Comment.associate = function (models) {
        Comment.belongsTo(models.client, {foreignKey: foreignKeys.client});
    };

    Comment.tableName = tableName;

    Comment.notUpdatableFields = [
        foreignKeys.client
    ];
    Comment.requiredFileds = [
        'text',
        'date',
        foreignKeys.client
    ];

    return Comment;
};
