var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('./mongoose'),
    passport = require('passport');

var app = express();

var db = mongoose();

var handler = require('./handler');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.post('/register', function(req, res, next) {
    handler.create(req, res, next);
});

app.post('/authentication', function(req, res, next) {
    handler.authenticate(req, res, next)
});

app.listen(9000);
console.log("ThoTho running at port 9000");
