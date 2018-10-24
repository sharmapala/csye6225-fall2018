var app = require("../../express");
var passport = require("passport");
var userModel = require("../models/user/user.model.server");
// var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var email_validator = require("email-validator");

// passport.use(new BasicStrategy(basicStrategy));
passport.use(new LocalStrategy(localStrategy));

app.get("/api/logout", logoutUser);
app.post("/user/register", registerUser);
app.get("/api/user/", findUserByUserName);
// app.get("/time/",passport.authenticate('basic', { session: false }), getTime);
app.post("/api/login/",passport.authenticate('local'), login);
app.get("/api/checkLogin", checkLogin);

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user.id)
        .then(
            function(user){
                done(null, user);
            },
            function(err){
                done(err, null);
            }
        );
}


// function basicStrategy(username, password, done) {
//     console.log(username+"-----------"+password);
//     userModel.findUserByUserName(username)
//         .then(function (user) {
//             if(!user) {
//                 return done(null, false);
//             }

//             bcrypt.compare(password, user.password, function(err, res){
//                 if(res)
//                     return done(null, user);
//             });
            
//         }, function (err) {
//             if(err) {
//                 return done(err);
//             }
//         });
// }

function localStrategy(username, password, done) {
    console.log(username+"-----------"+password);
    userModel.findUserByUserName(username)
        .then(function (user) {
            if(!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password, function(err, res){
                if(res)
                    return done(null, user);
            });
            
        }, function (err) {
            if(err) {
                return done(err);
            }
        });
}

function checkLogin(request, response) {
    response.send(request.isAuthenticated() ? request.user : "0");
}

// function getTime(request, response){
//     if(request.isAuthenticated()){
//    var time =  userModel.getTime();
//             response.json(time);
//     }
//     else{
//         response.json("User not logged in");
//     }
// }

function login(request, response) {
    var user = request.user;
    if(user.username === "" || user.password === "")
        return response.json("Username or Password cannot be empty");
    if(!email_validator.validate(user.username)){
        return response.json("Enter correct email address");
    }
    return response.json(user);
}

function findUserByUserName(request, response) {
    var username = request.query.username;
    userModel.findUserByUserName(username)
        .then(function (user) {
           return response.json(user);
        }, function (err) {
            return response.sendStatus(404).send(err);
        });
}

function logoutUser(request, response){
    console.log("Inside Logout")
    request.logout();
    response.redirect('/');
}

function registerUser(request, response) {
    var user = request.body;
    if(user.username === "" || user.password === "" || user.password1 === "")
        return response.json("Username or Password cannot be empty");
    if(!email_validator.validate(user.username)){
        return response.json("Enter correct email address");
    }
    userModel.findUserByUserName(user.username)
    .then(function (_user){
        if(!_user) {
            bcrypt.hash(user.password, 10, function (err, hash) {
                user.password = hash;
                userModel.createUser(user)
                .then(function (user) {
                    return response.json(user);
                });
            });
        }
        else{
            return response.json("User already exists");
        }
    });
    
    
}