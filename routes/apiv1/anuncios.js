"use strict";

var express = require("express");
var router = express.Router();
var jwtAuth = require('../../lib/jwtAuth');

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');
var Utils = require('../../lib/utils');
var utils = new Utils();

/* ------------------- * 
	 GET apiv1/anuncios/
   ------------------- */
router.get('/', jwtAuth(), function(req, res, next){
	var params = utils.getParams(req);

	var filter = {};

	if (params.nombre) {
		filter.nombre = new RegExp(params.nombre, "i");
	}
	
	if (params.esVenta) {
		filter.esVenta = (params.esVenta === 'TRUE');
	}

	var precio = Anuncio.fixFilterPrecio(params.precio);
	if (precio) {
		filter.precio = precio;
	}


	if (params.tags) {
		var tags = Anuncio.fixFilterTags(params.tags);
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

/* ----------------------- * 
	 GET apiv1/anuncios/tags
   ----------------------- */
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

module.exports = router;