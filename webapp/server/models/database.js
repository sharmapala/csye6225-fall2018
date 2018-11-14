// var q = require('q');
var winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
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
logger.info(sequelize);

db.users = require(__dirname+"/user/user.schema.server")(sequelize, Sequelize);
db.transactions = require(__dirname+"/transaction/transaction.schema.server")(sequelize, Sequelize);
db.attachments = require(__dirname+"/attachment/attachment.schema.server")(sequelize, Sequelize);
 // for local
// if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
//     var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
//     var password = process.env.MLAB_PASSWORD_WEBDEV;
//     connectionString = 'mongodb://' + username + ':' + password;
//     connectionString += '@ds149382.mlab.com:49382/heroku_v33hz0kp'; // user yours
// }
db.users.sync();
db.attachments.sync();
db.transactions.sync();
db.users.hasMany(db.transactions);
db.transactions.hasMany(db.attachments);
// .authenticate()
// .then(() => {
//   console.log('Connection has been established successfully.');
// })
// .catch(err => {
//   console.error('Unable to connect to the database:', err);
// });
// mongoose.Promise = q.Promise;
module.exports = db;