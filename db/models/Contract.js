module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define('contract',{
        date: DataTypes.DATE,
        file: DataTypes.STRING
    },{});

    Contract.associate = function (models){
        Contract.belongsTo(models.application);
    };

    return Contract;
};