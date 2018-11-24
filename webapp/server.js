require('dotenv').config();
var app = require(__dirname+"/express");
var db =  require(__dirname+"/server/models/database");
var express = app.express;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');
var flash = require('flash');
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

   app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "Hi",
     cookie: {
      "maxAge": 86400000,
      "secure": true
  },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
var expressStatsd = require('express-statsd');
app.use(expressStatsd());
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/server'));

require(__dirname +"/server/app");

app.listen(process.env.PORT || 5050, '0.0.0.0');

// db.users.sync();
// db.attachments.sync();
// db.transactions.sync();
// db.users.hasMany(db.transactions);
// db.transactions.hasMany(db.attachments);
