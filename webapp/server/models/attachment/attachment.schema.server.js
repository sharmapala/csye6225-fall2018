module.exports = (sequelize, DataTypes) => {  
    const Attachments = sequelize.define('Attachments', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    transactionId: {
      type: DataTypes.UUID,
      required: true
    },
    url: {
      type: DataTypes.STRING,
      required: true
    }
    });
    return Attachments;
}