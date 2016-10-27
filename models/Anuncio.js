"use strict";

var mongoose = require('mongoose');

//Estructura del modelo
//
var anuncioSchema = mongoose.Schema({
	nombre: String,
	descripcion: String,
	esVenta: Boolean,
	precio: Number, 
	foto: String,
	tags: [String]
});

//Métodos específicos del modelo
//
anuncioSchema.statics.lista = function(filter, sort, limit, skip, fields) {
	return new Promise(function(resolve, reject) {
		var query = Anuncio.find(filter);
		query.sort(sort);
		query.limit(limit);
		query.skip(skip);
		query.select(fields);

		query.exec(function(err, result){
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});

	});
}



//'Exportación' del modelo
//
var Anuncio = mongoose.model('Anuncio', anuncioSchema);