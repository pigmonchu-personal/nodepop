"use strict";

var mongoose = require('mongoose');

//Estructura del modelo
//
var userSchema = mongoose.Schema({
	nombre: String,
	email: String,
	password: String
});

//Métodos específicos del modelo
//

//'Exportación' del modelo
//
var User = mongoose.model('User', userSchema);
