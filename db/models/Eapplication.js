const tableName = 'eapplication';

const foreignKeys = {
};

module.exports = (sequelize, DataTypes) => {
    const Eapplication = sequelize.define(tableName, {
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        city: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        course: DataTypes.STRING,
        type: DataTypes.STRING,
        social: DataTypes.STRING,
        source: DataTypes.STRING,
        wantTime: DataTypes.STRING,
        comment: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        wantPractice: DataTypes.TINYINT,
    }, {});

    Eapplication.associate = function (models) {
    };

    Eapplication.tableName = tableName;

    return Eapplication;
};

