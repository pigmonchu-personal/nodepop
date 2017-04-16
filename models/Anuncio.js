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

anuncioSchema.index({ nombre:1 });
anuncioSchema.index({ esVenta:1 });
anuncioSchema.index({ precio:1 });
anuncioSchema.index({ tags:1 });
anuncioSchema.index({ dewscripcion:1 });
anuncioSchema.index({ foto:1 });


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
};

anuncioSchema.statics.tags = function() {
	return new Promise(function(resolve, reject) {
		var query = Anuncio.find().distinct('tags', function(err, etiquetas){
			if (err) {
				reject(err);
				return;
			}
			
			resolve(etiquetas);
			
		});
	});
};

//'Exportación' del modelo
//

anuncioSchema.statics.fixFilterPrecio = function (precio) {
	var re = /^((\s?|\d+)-?(\s?|\d+))$$/;
            
	if (precio && re.test(precio) && precio !== '-') {
		var precios = precio.split('-');
		if (precios.length===1) {
			precio = precios[0];
		} else {
			precio = {};
			if (precios[0]!=='') {
				precio.$gte = precios[0];
			}
			if (precios[1]!=='') {
				precio.$lte = precios[1];
			}
		}
		return precio;
	}
}

anuncioSchema.statics.fixFilterTags = function (tags) {
		tags = tags.toUpperCase().split(' ');
		if (tags.length === 1) {
			return tags[0];
		}
		var $and = [];
		for (var i=0; i < tags.length; i++ ) {
			var otag = {tags: tags[i]};
			$and.push(otag);
		}
		return $and;
}

var Anuncio = mongoose.model('Anuncio', anuncioSchema);