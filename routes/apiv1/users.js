"use strict";

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var User = mongoose.model('User');

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
			next(err);
		});
	
});

router.post('/signup', function(req, res, next){
	var email = req.body.email;
	var pass = req.body.pass;
	var rptpass = req.body.rptpass;
	var name = req.body.name;

	var user = new User({email: email, password: pass, nombre: name});

	if (pass !== rptpass) {
		var err = new Error();
		err.name = 'pwd not match';
// 		err.message = _("passwords do'nt match");
		err.message = "passwords do'nt match";
		next(err);
		return;
	};

/*
	if (!validator.email(email)) {
		var err = new Error();
		err.name = 'mail format';
		err.message = 'mail malformed';
		next(err);
		return;
	}
*/

	user.save(function(err, createdUser){
		if (err) {
			console.log(err);
			if (err.name === 'MongoError') {
			var errLimpio = new Error();
				errLimpio.name = 'db error';
	// 			err.message = _('system error');
				errLimpio.message = 'database error';
				errLimpio.error = {code: err.code, errmsg: err.errmsg};
				err = errLimpio;
			}
			
			if (err.name === 'ValidatorError') {
				
			}

			next(err);
			return;
		}
		var result = {success:true}
		result.usuario = createdUser;
		res.json(result);
	})
	
});

module.exports = router;