"use strict";

var mongoose = require("mongoose");
var db = mongoose.connection;
var config = require('config');

var host = config.get('dbConfig.host');
var port = config.get('dbConfig.port');
var dbName = config.get('dbConfig.dbName');

mongoose.Promise = global.Promise;

db.on('error', console.log.bind(console));

db.once('open', function(){
	console.log('Conectado a mongodb');
});

mongoose.connect('mongodb://' + host + ':' + port + '/' + dbName);
