"use strict";

var fs = require('fs');
var Client = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var csv = require('fast-csv');
var path = require('path');
var bcrypt = require('bcrypt');
var config = require('config');

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

require('../models/Anuncio');
var Anuncio = mongoose.model('Anuncio');

require('../models/User');
var User = mongoose.model('User');
var pideParam = function(question, data, obj) {
	obj = obj ? obj : {};

	return new Promise(function(resolve, reject) {
		rl.question(question, function(answer) {
			obj[data] = answer;
			resolve(obj);
		});
	});
};

var borraCollection = function(tabla) {
	return new Promise(function(resolve, reject) {
		if (mongoose.connection.collections[tabla]) {
				mongoose.connection.collections[tabla].drop( function(err) {
				    console.log('collection '+tabla+' dropped');
						resolve();
				});
			}		
		});
};

var cargaUsuario = function(usuario) {
	usuario = new User(usuario);
	usuario.save(function(err, usuarioCreado){
		if (err) {
			console.log('Error al crear usuario: '+err);
			return;
		}
		console.log('User '+usuarioCreado.nombre+' creado');
	});
};

var cargaAnuncios = function() {
	var stream = fs.createReadStream("db/anuncios.csv");
	var fila = 0;
	var nombres = [];
	var arrRegistros = [];
	var csvStream = csv
	    .parse({quote: '"', delimiter:','})
	    .on('data', function(data){
				var registro = {};
	
				if (fila === 0) {
					data.forEach(function(name) {
						nombres.push(name);
					});
					fila+=1;
				} else {
					for (var i=0; i<data.length; i+=1) {
						registro[nombres[i]] = data[i];					
					}
					registro.esVenta = registro.esVenta === '1';
					registro.tags = [];
					if (registro.esWORK === '1') {
						registro.tags.push('WORK');
					}
					if (registro.esLIFESTYLE === '1') {
						registro.tags.push('LIFESTYLE');
					}
					if (registro.esMOTOR === '1') {
						registro.tags.push('MOTOR');
					}
					if (registro.esMOBILE === '1') {
						registro.tags.push('MOBILE');
					}
					delete registro.esMOTOR;
					delete registro.esLIFESTYLE;
					delete registro.esWORK;
					delete registro.esMOBILE;
					registro.precio = parseFloat(registro.precio);
					arrRegistros.push(registro);
				}
	    })
	    .on('end', function(){
				Anuncio.collection.insert(arrRegistros, function(err, docs) {
					if (err) {
						console.log('Error insercion de anuncios: '+err);
						return;
					}
					console.log('%d anuncios grabados', arrRegistros.length);
					mongoose.connection.close();
				});
	    })
	;
	 
	stream.pipe(csvStream);
};

var usuario = {};

pideParam('Introduce tu nombre: ', 'nombre', usuario)
	.then(function(usuario){
		return pideParam('Introduce tu email: ', 'email', usuario);
	})
	.then(function(usuario){
		return pideParam('Introduce tu contraseña: ', 'password', usuario);
	})
	.then(function(usuario){
		rl.close();
		process.stdin.destroy();

		require('../lib/mongoConnection'); //Conecto a base de datos

/*
		var salt = bcrypt.genSaltSync(config.get('genSalt'));
		usuario.password = bcrypt.hashSync(usuario.password, salt);
*/

		/*  -----------------
				BORRADO DE TABLAS
		    -----------------  */
		borraCollection('users')
			.then(function(){
				borraCollection('anuncios');
			})
			.then(function(){
				cargaUsuario(usuario);
			})
			.then(cargaAnuncios)
		;	

	})
	.catch(function(err) {
		console.log('Error: '+ err);
	})
;











