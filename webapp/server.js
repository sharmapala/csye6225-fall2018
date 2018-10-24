var app = require('./express');
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

require("./server/app");

app.listen(5000, '0.0.0.0');