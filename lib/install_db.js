"use strict";

var fs = require('fs');
var Client = require('mongodb').MongoClient;
var csv = require('fast-csv');

var config = {};
config.server = 'localhost';
config.port   = 27017; 


/*  -----------------
		BORRADO DE TABLAS
    -----------------  */
var db;
var dbCreate = function(servidor, puerto, dbName) {
	return new Promise(function(resolve, reject){
		Client.connect('mongodb://'+servidor+':'+puerto+'/'+dbName, function(err, db) {
			if (err) {
				reject(err);
			} 

			resolve(db);
		});
	});
};

var dropTabla = function(db, tabla) {
	return new Promise(function(resolve, reject) {
		db.dropCollection(tabla, function(err, result) {
			if (err && err.message !== 'ns not found') {
				reject(err);
			}
 
			console.log('Borrado correcto de '+tabla);
			resolve(db);
    });		
	});
}; 


dbCreate(config.server, config.port, 'nodepop')
	.then(function(db) {
		return dropTabla(db, 'anuncios');
	})
	.then(function(db) {
		return dropTabla(db, 'usuarios');
	})
;

/*  -----------------
		CARGA DE ANUNCIOS
    -----------------  */
var stream = fs.createReadStream("./anuncios.csv");

var fila = 0;
var nombres = [];
var arrRegistros = [];
var csvStream = csv
    .parse({quote: '"', delimiter:','})
    .on("data", function(data){
			var registro = {};

			if (fila === 0) {
				data.forEach(function(name) {
					nombres.push(name);
				});
			} else {
				for (var i=0; i<data.length; i++) {
					registro[nombres[i]] = data[i];					
				}
				arrRegistros.push(registro);
			}
			fila++;
    })
    .on("end", function(){
			console.log(arrRegistros);
    });
 
stream.pipe(csvStream);
