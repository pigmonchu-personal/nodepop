"use strict";

var express = require("express");
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function(req, res, next){
	var nombre = req.query.nombre;
	var sort = req.query.sort || null;
	var limit = +req.query.limit || null;
	var skip = parseInt(req.query.skip) || 0;
	var fields = req.query.fields || null;
	var precio = req.query.precio ;

	var filter = {};
	if (nombre) {
		filter.nombre = nombre;
	}

//refactorizar
	precio = filterPrecio(precio);
	if (precio) {
		filter.precio = precio;
	}

	Anuncio.lista(filter, sort, limit, skip, fields)
		.then(function(lista) {
			res.json({success:true, count: lista.length, Anuncios:lista});
		}).catch(function(err){
			next(err);
		});
});

function filterPrecio(precio) {
	var re = /^((\s?|\d+)-?(\s?|\d+))$$/;
            
	if (precio && re.test(precio) && precio !== '-') {
		var precios = precio.split('-');
console.log(precios);
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
console.log(precio);
		return precio;
	}
}

module.exports = router;