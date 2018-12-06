var app = require(process.cwd()+"/express");
var async = require('async');
var passport = require("passport");
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var aws = require('aws-sdk');
aws.config.update({region:'us-east-1'});
var userModel = require(process.cwd()+"/server/models/user/user.model.server");
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var email_validator = require("email-validator");
var flash = require('flash');
var ses = require('nodemailer-ses-transport');
var ttl = 1200;
var winston = require('winston');
var SDC = require('statsd-client'),
sdc = new SDC({host: 'localhost', port: 8125});
resetPassword.counter = 0;
getTime.counter = 0;
login.counter = 0;
registerUser.counter = 0;
logoutUser.counter = 0;
findUserByUserName.counter = 0;
var targetarn_sns = process.env.TARGETARN;
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
  var cw = new aws.CloudWatch({apiVersion: '2010-08-01'});

  

 
passport.use(new BasicStrategy(basicStrategy));
passport.use(new LocalStrategy(localStrategy));

function statsd (path) {
  return function (req, res, next) {
    var method = req.method || 'unknown_method';
    req.statsdKey = ['http', method.toLowerCase(), path].join('.');
    next();
  };
}
  
app.get("/api/logout", logoutUser);
app.post("/api/reset", statsd('reset'), resetPassword);
app.post("/user/register", registerUser);
app.get("/api/user", findUserByUserName);
app.get("/time/",passport.authenticate('basic', { session: false }), getTime);
//app.get("/time/",getTime);
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


function basicStrategy(username, password, done) {
    //console.log(username+"-----------"+password);
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

function localStrategy(username, password, done) {
    //logger.info(username+"-----------"+password);
    userModel.findUserByUserName(username)
        .then(function (user) {
            if(!user) {
                logger.info("user null");
                return done(null, false);
            }

            bcrypt.compare(password, user.password, function(err, res){
                if(res)
                    return done(null, user);
            });
            
        }, function (err) {
            if(err) {
                logger.info("error");
                return done(err);
            }
        });
}

function checkLogin(request, response) {
    response.send(request.isAuthenticated() ? request.user : "0");
}

function getTime(request, response){
  getTime.counter++;
    console.log(getTime.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api - /time/',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: getTime.counter
          },
        ],
        Namespace: 'TimeApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    if(request.isAuthenticated()){
   var time =  userModel.getTime();
            response.json(time);
    }
    else{
        response.json("User not logged in");
    }
}

function resetPassword(request, response) {
    sdc.increment('reset.counter');
    resetPassword.counter++;
    console.log(resetPassword.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api - /api/reset',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: resetPassword.counter
          },
        ],
        Namespace: 'ResetApi/Traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var email = request.body.email;
    console.log("aa gya bhiya " + email );
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            return done(err, token);
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
                return done(null, token, user);
              });
            })
            .catch(function(err){
                console.log(err);
            });
          },
          
          function(token, user, done) {
            var sns = new aws.SNS({region: 'us-east-1'});
            var mailOptions = {
            
            TargetArn: targetarn_sns,
            
           // TargetArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:password_reset`,
           Message: email + ':' + token + ':' + ttl,
            };
            const snsResult = sns.publish(mailOptions,(err, data) => {
                if (err) {
                   console.log("ERROR", err.stack);
                   return done(err, '');
                }else{
                logger.info('SNS ok: ' , JSON.stringify (data));
                return done(null,data);
              }});
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

    login.counter++;
    console.log(login.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api - /api/login',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: login.counter
          },
        ],
        Namespace: 'LoginApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var user = request.user;
    if(user.username === "" || user.password === "")
        return response.json("Username or Password cannot be empty");
    if(!email_validator.validate(user.username)){
        return response.json("Enter correct email address");
    }
    var x = JSON.parse(JSON.stringify(user));
                  delete x.password;
                  console.log(x);
                    return response.json(x);
   // return response.json(user);
}

function findUserByUserName(request, response) {
  findUserByUserName.counter++;
    console.log(findUserByUserName.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api - /api/user"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: findUserByUserName.counter
          },
        ],
        Namespace: 'UserApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    
    var username = request.query.username;
    userModel.findUserByUserName(username)
        .then(function (user) {
           return response.json(user);
        }, function (err) {
            return response.json(err);
        });
}

function logoutUser(request, response){
  logoutUser.counter++;
    console.log(logoutUser.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api -  /api/logout"',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: logoutUser.counter
          },
        ],
        Namespace: 'LogoutApi/traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    
    console.log("Inside Logout")
    request.logout();
    response.redirect('/');
}

function registerUser(request, response) {
    
  registerUser.counter++;
    console.log(registerUser.counter);
    var params = {
        MetricData: [
          {
            MetricName: 'api - /user/register',
            Dimensions: [
              {
                Name: 'api',
                Value: 'counter'
              },
            ],
            Unit: 'None',
            Value: registerUser.counter
          },
        ],
        Namespace: 'RegisterApi/Traffic'
      };
    cw.putMetricData(params, function(err, data) {
        if (err) {
          logger.info("Error", err);
        } else {
          logger.info("Success", JSON.stringify(data));
        }
      });
    var user = request.body;
    if(user.username === "" || user.password === "" || user.password1 === "")
        return response.json("Username or Password cannot be empty");
    if(!email_validator.validate(user.username)){
        return response.json("Enter correct email address");
    }
    userModel.findUserByUserName(user.username)
    .then(function (_user){
        logger.info("user is " + _user);
        if(!_user) {
            bcrypt.hash(user.password, 10, function (err, hash) {
                user.password = hash;
                userModel.createUser(user)
                .then(function (user) {
                    var x = JSON.parse(JSON.stringify(user));
                  delete x.password;
                  console.log(x);
                    return response.json(x);
                   // return response.json(user);
                });
            });
        }
        else{
            return response.json("User already exists");
        }
    });
    
    
}
