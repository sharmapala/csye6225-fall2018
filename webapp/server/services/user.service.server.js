var app = require(process.cwd()+"/express");
var async = require('async');
var passport = require("passport");
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var aws = require('aws-sdk');
aws.config.update({region:'us-east-1'});
var userModel = require(process.cwd()+"/server/models/user/user.model.server");
// var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var email_validator = require("email-validator");
var flash = require('flash');
var ses = require('nodemailer-ses-transport');

// passport.use(new BasicStrategy(basicStrategy));
passport.use(new LocalStrategy(localStrategy));

app.get("/api/logout", logoutUser);
app.post("/api/reset", resetPassword);
app.post("/user/register", registerUser);
app.get("/api/user", findUserByUserName);
// app.get("/time/",passport.authenticate('basic', { session: false }), getTime);
app.post("/api/login",passport.authenticate('local'), login);
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

function resetPassword(request, response, next) {
    var email = request.body.email;
    console.log("aa gya bhiya " + email );
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
            userModel.findUserByUserName(email)
            .then(function (user){
              if (!user) {
                return response.flash('error', 'No account with that email address exists.');
                 
              }
      
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
              user.save().then(function() {
                done(null, token, user);
              });
            })
            .catch(function(err){
                console.log(err);
            });
          },
          function(token, user, done) {
            var sns = new aws.SNS({region: 'us-east-1'});
            // var smtpTransport = nodemailer.createTransport(ses({
            //     //transport: 'ses', // loads nodemailer-ses-transport
            //     accessKeyId: process.env.AWSKEY,
            //     secure: true,
            //     port: 25,
            //     secretAccessKey: process.env.AWSSECRETKEY
            // //   service: 'SendGrid',
            // //   auth: {
            // //     user: process.env.SENDGRID_USER,
            // //     pass: process.env.SENDGRID_PASSWORD
            // //   }
            // }));
            //SnsArn = process.env.TARGET_ARN
            var mailOptions = {
            //   to: email,
            //   from: 'palaksharma1807@gmail.com',
            //   subject: 'Node.js Password Reset',
            //Message: contentSMS,  // here your sms
            
            TargetArn: 'arn:aws:sns:us-east-1:673890306023:password_reset',
           // TargetArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:password_reset`,
           Message: email + ':' + token,
            // Message: email + ' : You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            //   'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            //   'http://' + request.headers.host + '/reset/' + token + '\n\n' +
            //   'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            const snsResult = sns.publish(mailOptions,(err, data) => {
                if (err) {
                   console.log("ERROR", err.stack);
                }
                console.log('SNS ok: ' , JSON.stringify (data));
              });
            // smtpTransport.sendMail(mailOptions, function(err) {
            //   request.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            //   done(err, 'done');
            // });
          }
        ], function(err) {
            console.log(err);
          if (err) return next(err);
        
        });
      }

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
            return response.json(err);
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
        console.log("user is " + _user);
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