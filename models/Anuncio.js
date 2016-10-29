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
anuncioSchema.statics.lista = function(filter, params) {
	return new Promise(function(resolve, reject) {
		var query = Anuncio.find(filter);
		query.sort(params.sort);
		query.select(params.fields);
		query.limit(params.limit);
		query.skip(params.skip);

		
		query.exec(function(err, listado){
			if (err) {
				reject(err);
				return;
			}
			if (params.count) {
				var qCount=Anuncio.find(filter);
				qCount.count(true);
				qCount.exec(function(err, total){
					if (err) {
						reject(err);
						return;
					}
					resolve({total: total, listado });
				});
				
			} else {
				resolve(listado);
			}
		});

	});
}

//'Exportación' del modelo
//
var Anuncio = mongoose.model('Anuncio', anuncioSchema);