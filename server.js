// modules =================================================
const express = require('express'),
 app = express(),
 bodyParser = require('body-parser'),
 http = require('http').Server(app),
 dotenv = require('dotenv');

// configuration ===========================================

//load environment variables,
//either from .env files (development),
//heroku environment in production, etc...
dotenv.load();

//parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing url encoded

// view engine ejs
app.set('view engine', 'ejs');

// routes
require('./app/routes/routes')(app);

//botkit (apres port)
require('./app/controllers/botkit')

//START ===================================================
http.listen(app.get('port'), function(){
    console.log('listening on port ' + app.get('port'));
});