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

//'Exportación' del modelo
//
var Anuncio = mongoose.model('Anuncio', anuncioSchema);