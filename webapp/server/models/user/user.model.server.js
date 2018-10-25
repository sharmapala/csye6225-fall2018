// var mongoose = require("mongoose");
// var userSchema = require("./user.schema.server");
// var userModel =  mongoose.model("UserModel", userSchema);

var db =  require(process.cwd()+"/server/models/database");

var userModel = db.users;


//var user = {'username': 'ytrr' , 'password':'err'};
//userModel.create(user);
userModel.getTime = getTime;
userModel.createUser = createUser;
userModel.findUserByUserName = findUserByUserName;
userModel.findUserById = findUserById;
userModel.findUserByCredentials = findUserByCredentials;

module.exports = userModel;

function getTime(){
    return JSON.parse('{ "currentTime" : "'+new Date().toLocaleTimeString()+'" }');
}

function createUser(user) {
//    userModel.sync({force: true});
       // console.log("user" + user);
        return userModel.create(user);
        
    
}

function findUserByUserName(username) {
    return userModel.findOne({where : {username: username}});
}

function findUserById(userId) {
    return userModel
        .findById(userId);
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password});
}