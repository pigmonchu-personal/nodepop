"use strict";

var fs = require('fs');
var Client = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var csv = require('fast-csv');
var path = require('path');

var appDir = path.dirname(require.main.filename);
console.log(appDir);

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

var stream = fs.createReadStream(appDir+"/../db/anuncios.csv");

var fila = 0;
var nombres = [];
var arrRegistros = [];
var csvStream = csv
    .parse({quote: '"', delimiter:',', ignoreEmpty: true})
    .on('data', function(data){
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
				arrRegistros.push(registro);
			}
    })
    .on('end', function(){
			arrRegistros.forEach(function(registro) {
				var anuncio = new Anuncio(registro);
				anuncio.save(function(err, anuncioCreado){
					if (err) {
						console.log('Error al crear anuncio '+ anuncioCreado.nombre +' => '+error);
						return;
					}
					console.log('Anuncio '+anuncioCreado.nombre+' creado');
				});
			});

	    console.log('Fin de carga');
			mongoose.connection.close();

    })
;
 
stream.pipe(csvStream);



