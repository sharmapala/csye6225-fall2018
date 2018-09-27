var q = require('q');
const Sequelize = require('sequelize');
//var connectionString = 'mysql://127.0.0.1:3306/registeredMembers';
const sequelize = new Sequelize('registeredMembers', 'root', '', {
    host:'localhost',
    dialect: 'mysql',
    port:3306
});
 // for local
// if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
//     var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
//     var password = process.env.MLAB_PASSWORD_WEBDEV;
//     connectionString = 'mongodb://' + username + ':' + password;
//     connectionString += '@ds149382.mlab.com:49382/heroku_v33hz0kp'; // user yours
// }
var db = sequelize;
// .authenticate()
// .then(() => {
//   console.log('Connection has been established successfully.');
// })
// .catch(err => {
//   console.error('Unable to connect to the database:', err);
// });
// mongoose.Promise = q.Promise;
module.exports = db;