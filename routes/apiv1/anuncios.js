"use strict";

var express = require("express");
var router = express.Router();
var jwtAuth = require('../../lib/jwtAuth');

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');
var CustomError = require('../../lib/customError');
var Utils = require('../../lib/utils');
var LanguagesHandler = require('../../lib/userLanguages');
var utils = new Utils();

/* ------------------- * 
	 GET apiv1/ads/
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
	 GET apiv1/ads/tags
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
/* ----------------------- * 
     POST apiv1/ads/
   ----------------------- */
router.post('/', jwtAuth(), function(req, res, next){

	var langsHandler = new LanguagesHandler(req);

	var nombre = req.body.nombre;
	var descripcion = req.body.descripcion;
	var esVenta = req.body.esVenta;
	var precio = req.body.precio;
	var tags = req.body.tags;
	var foto = req.body.foto; 
	
	var anuncio = new Anuncio({nombre: nombre, descripcion: descripcion, esVenta: esVenta, precio: precio, tags: tags, foto: foto});

	anuncio.save(function(err, createdAd){
		if (err) {
			if (err.name === 'MongoError') {
				res.status(500).json(new CustomError(CustomError.prototype._DDBB, langsHandler.traduction("Database Error"), err));
				return;
			}

			if (err.name === 'ValidationError') {
				res.status(400).json(new CustomError(CustomError.prototype._VALI, langsHandler.traduction(err.message), langsHandler.procesaMensajesValidacion(err.errors)));
				return;
			}
			
			res.status(500).json(err.message)
			return;
		}
	
		var result = {success:true}
		result.anuncio = createdAd;
		res.json(result);
	});


});

module.exports = router;