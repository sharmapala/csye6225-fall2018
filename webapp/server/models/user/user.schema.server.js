module.exports = (sequelize, DataTypes) => {  
    const Users = sequelize.define('Users', {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        required: true
      }
    });
    return Users;
}