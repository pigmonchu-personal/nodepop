"use strict";

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var CustomError = require('../../lib/customError');

router.post('/authenticate', function(req, res, next){
	var email = req.body.email;
	var pass = req.body.pass;
	
	//busco el usuario en la base de datos
	//y compruebo credenciales

	User.authenticate(email, pass)
		.then(function(token) {
			var result = {success:true}
			result.token = token;
			res.json(result);
		}).catch(function(err){
			res.json(new CustomError(CustomError.prototype._AUTH, err));
		});
	
});

router.post('/signup', function(req, res, next){
	var email = req.body.email;
	var pass = req.body.pass;
	var rptpass = req.body.rptpass;
	
	var user = new User({email: email, password: pass});

	if (pass !== rptpass) {
		res.json(new CustomError(CustomError.prototype._AUTH, "Passwords do'nt match"));
		next(err);
		return;
	};

	user.save(function(err, createdUser){
		if (err) {
			if (err.name === 'MongoError') {
console.log(err.toString());
				res.json(new CustomError(CustomError.prototype._DDBB, err.message, {code: err.code}));
				return;
			}

			if (err.name === 'ValidationError') {
				res.json(new CustomError(CustomError.prototype._VALI, err.message, err.errors));
				return;
			}
			
			res.json(null, err.message);
			return;
		}
		var result = {success:true}
		result.usuario = createdUser;
		res.json(result);
	})
	
});

module.exports = router;