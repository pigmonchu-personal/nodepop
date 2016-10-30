"use strict";

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('config');
var validator = require('validator');
var CustomError = require('../lib/customError');

//Estructura del modelo
//
var userSchema = mongoose.Schema({
	nombre: String,
	email: {
		type: String,
		validate: {
			validator: validator.isEmail,
			message: 'User mail malformed' 
		},
		required: [true, 'User mail required']
	},
	password: {
		type: String,
		required: [true, 'User password required']
	}
});

userSchema.index({ email:1 }, { unique: true });

userSchema.pre('save',function(next, done){
	var user = this;
	
	if (!user.isModified('password')) {
		next();
		return;
	}
	bcrypt.genSalt(config.get('genSalt'), function(err, salt) {
		if (err) {
			next(err);
			return;
		}

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				next(err);
				return;
			}
			
			user.password = hash;
			next();
		});
	});
});

userSchema.statics.authenticate = function(email, pass) {
	return new Promise(function(resolve, reject) {
		var query = User.findOne({email: email});
		query.exec(function(err, usuario){
			if (err) {
console('es aquí');
				console.log(err);
				reject(err);					
			}

			if (!usuario ) {
				reject("Wrong user or password");
				return;					
			}
			if (bcrypt.compareSync(pass, usuario.password)) {
				let token = jwt.sign({id: usuario.id}, config.get('appKey'), {
					expiresIn: '2 hours'
				});
				resolve(token);					
			}

			reject("Wrong user or password");
			return;					
	
		}); 

	});
};

//'Exportación' del modelo
//
var User = mongoose.model('User', userSchema);
