"use strict";

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('config');

//Estructura del modelo
//
var userSchema = mongoose.Schema({
	nombre: String,
	email: String,
	password: String
});

userSchema.index({ email:1 }, { unique: true });
//
userSchema.statics.authenticate = function(email, pass) {
	return new Promise(function(resolve, reject) {
		var query = User.findOne({email: email});
		query.exec(function(err, usuario){
				if (err) {
					console.log('Error: '+err);
					reject(err);					
				}
				err = {};
				
				if (!usuario ) {
					err.name ='wrong credentials';
					err.message = 'Usuario o contraseña incorrectos';
					reject(err);
					return;					
				}
				if (bcrypt.compareSync(pass, usuario.password)) {
					let token = jwt.sign({id: usuario.id}, config.get('appKey'), {
						expiresIn: '2 hours'
					});
					resolve(token);					
				}

				err.name ='wrong credentials';
				err.message = 'Usuario o contraseña incorrectos';
				reject(err);					
				return;					
	
		}); 

	});
}

//'Exportación' del modelo
//
var User = mongoose.model('User', userSchema);
