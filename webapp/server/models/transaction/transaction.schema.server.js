module.exports = (sequelize, DataTypes) => {  
    const Transactions = sequelize.define('Transactions', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        userId: DataTypes.INTEGER,
        description: DataTypes.STRING,
        merchant: DataTypes.STRING,
        amount: DataTypes.STRING,
        date: DataTypes.STRING,
        category: DataTypes.STRING
    });
    return Transactions;
}