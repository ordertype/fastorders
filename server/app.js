/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');



var mongo = process.env.DB_PORT_27017_TCP_ADDR;
var mongo_port = process.env.DB_PORT_27017_TCP_PORT;

//var mongo = process.env.MONGO_PORT_27017_TCP_ADDR;
//var mongo_port = process.env.MONGO_PORT_27017_TCP_PORT;

console.log('Mongo ADDR: %s ', mongo);
console.log('Mongo PORT: %s ', mongo_port);


// Connect to our mongo database
config.mongo.uri = 'mongodb://' + mongo + ':' + mongo_port + '/fastorders-dev';


// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;