// var q = require('q');
const db = {}
const Sequelize = require('sequelize');
//var connectionString = 'mysql://127.0.0.1:3306/registeredMembers';
var sequelize;
if(process.env.RDS_HOSTNAME){
sequelize = new Sequelize('csye6225', process.env.RDS_USERNAME,process.env.RDS_PASSWORD , {
    host     : process.env.RDS_HOSTNAME,
    //user     : process.env.RDS_USERNAME,
    //password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    dialect: 'mysql',
    port:3306
});
}
else{
sequelize = new Sequelize('registeredMembers', 'root', '', {
    host     : 'localhost',
    dialect: 'mysql',
    port:3306
});
}
  

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user/user.schema.server")(sequelize, Sequelize);
db.transactions = require("../models/transaction/transaction.schema.server")(sequelize, Sequelize);
db.attachments = require("../models/attachment/attachment.schema.server")(sequelize, Sequelize);
 // for local
// if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
//     var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
//     var password = process.env.MLAB_PASSWORD_WEBDEV;
//     connectionString = 'mongodb://' + username + ':' + password;
//     connectionString += '@ds149382.mlab.com:49382/heroku_v33hz0kp'; // user yours
// }
// db.users.sync();
// db.attachments.sync();
// db.transactions.sync();
// db.users.hasMany(db.transactions);
// db.transactions.hasMany(db.attachments);
// .authenticate()
// .then(() => {
//   console.log('Connection has been established successfully.');
// })
// .catch(err => {
//   console.error('Unable to connect to the database:', err);
// });
// mongoose.Promise = q.Promise;
module.exports = db;