"use strict";

var express = require("express");
var router = express.Router();
var jwtAuth = require('../../lib/jwtAuth');

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', jwtAuth(), function(req, res, next){
	var params = getParams(req);

	var filter = {};

	if (params.nombre) {
		filter.nombre = new RegExp(params.nombre, "i");
	}
	
	if (params.esVenta) {
		filter.esVenta = (params.esVenta === 'TRUE');
	}

	var precio = fixFilterPrecio(params.precio);
	if (precio) {
		filter.precio = precio;
	}


	if (params.tags) {
		var tags = fixFilterTags(params.tags);
		if (Array.isArray(tags)) {
			filter.$and = tags;
		} else {
			filter.tags = tags;
		}
	}
	
  console.log('Lista de anuncios por...');

	Anuncio.lista(filter, params)
		.then(function(lista) {
			var result = {success:true};
			if (lista.total) {
				result.total = lista.total;
				result.Anuncios = lista.listado;
			} else {
				result.Anuncios = lista;
			} 

			res.json(result);
		}).catch(function(err){
			next(err);
		});
});

router.get('/tags', jwtAuth(), function(req, res, next){

	Anuncio.tags()
		.then(function(lista) {
			var result = {success: true};
			result.Tags = lista;
			res.json(result);
		})
		.catch(function(err){
			res.json(err);
		})
});

function getParams(req) {
	var params = {};
	params.sort = req.query.sort || null;
	params.limit = +req.query.limit || null;
	params.skip = parseInt(req.query.skip) || 0;
	params.fields = req.query.fields || null;
	params.nombre = req.query.nombre;
	params.esVenta = req.query.venta ? req.query.venta.toUpperCase() : null;
	params.precio = req.query.precio;
	params.tags = req.query.tag;
	params.count = req.query.count ? (req.query.count.toUpperCase() === 'TRUE' ? true : null ): null;
	
	return params;
}

function fixFilterPrecio(precio) {
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

function fixFilterTags(tags) {
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

module.exports = router;