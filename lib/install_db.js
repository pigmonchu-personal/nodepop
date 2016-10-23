"use strict";

var fs = require('fs');
var Client = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var csv = require('fast-csv');

require('../models/Anuncio');
var Anuncio = mongoose.model('Anuncio');

/*  -----------------
		BORRADO DE TABLAS
    -----------------  */
require('../lib/mongoConnection'); //Conecto a base de datos


if (mongoose.connection.collections['anuncios']) {
	mongoose.connection.collections['anuncios'].drop( function(err) {
	    console.log('collection anuncios dropped');
	});
}

if (mongoose.connection.collections['usuarios']) {
	mongoose.connection.collections['usuarios'].drop( function(err) {
	    console.log('collection usuarios dropped');
	});
}

/*  -----------------
		CARGA DE ANUNCIOS
    -----------------  */
var stream = fs.createReadStream("./anuncios.csv");

var fila = 0;
var nombres = [];
var arrRegistros = [];
var csvStream = csv
    .parse({quote: '"', delimiter:','})
    .transform(function(data){
			var registro = {};

			if (fila === 0) {
				data.forEach(function(name) {
					nombres.push(name);
				});
				fila++;
			} else {
				for (var i=0; i<data.length; i++) {
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
				registro.precio = parseFloat(registro.precio);
				var anuncio = new Anuncio(registro);
				anuncio.save(function(err, anuncioCreado){
					if (err) {
						console.log('Error al crear anuncio '+ anuncioCreado.nombre +' => '+error);
						return;
					}
					console.log('Anuncio '+anuncioCreado.nombre+' creado');
				});
				arrRegistros.push(registro);
			}
    })
;
 
stream.pipe(csvStream);




