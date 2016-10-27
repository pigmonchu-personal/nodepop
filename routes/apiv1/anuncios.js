"use strict";

var express = require("express");
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function(req, res, next){
	var sort = req.query.sort || null;
	var limit = +req.query.limit || null;
	var skip = parseInt(req.query.skip) || 0;
	var fields = req.query.fields || null;

	var tags = req.query.tag;
	var filter = {};

	if (req.query.nombre) {
		filter.nombre = new RegExp(req.query.nombre, "i");
	}
	
	if (req.query.venta) {
		filter.esVenta = (req.query.venta.toUpperCase() === 'TRUE');
	}

	var precio = filterPrecio(req.query.precio);
	if (precio) {
		filter.precio = precio;
	}

	if (tags) {
		tags = filterTags(tags);
		if (Array.isArray(tags)) {
			filter.$and = tags;
		} else {
			filter.tags = tags;
		}
	} 

  console.log('Lista de anuncios por...');
  console.log(filter);

	Anuncio.lista(filter, sort, limit, skip, fields)
		.then(function(lista) {
			var result = {success:true}
			if (req.query.count.toUpperCase() === 'TRUE') {
				result.count = lista.length;
			} 
			result.Anuncios = lista;
			res.json(result);
		}).catch(function(err){
			next(err);
		});
});

function filterPrecio(precio) {
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

function filterTags(tags) {
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