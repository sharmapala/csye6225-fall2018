var app = require(__dirname+"/express");
var db =  require(__dirname+"/server/models/database");
var express = app.express;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "Hi",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

require(__dirname +"/server/app");

app.listen(process.env.PORT || 5000, '0.0.0.0');

// db.users.sync();
// db.attachments.sync();
// db.transactions.sync();
// db.users.hasMany(db.transactions);
// db.transactions.hasMany(db.attachments);