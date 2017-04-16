"use strict";

var express = require('express');
var jwt = require('jsonwebtoken');
var accepts = require('accepts');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var CustomError = require('../../lib/customError');
var LanguagesHandler = require('../../lib/userLanguages');
var router = express.Router();

/* POST apiv1/
             ============= */
router.post('/authenticate', function(req, res, next){
/*           ============= */

	var langsHandler = new LanguagesHandler(req);
	
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
			res.status(400).json(new CustomError(CustomError.prototype._AUTH, langsHandler.traduction(err)));
		});
	
});

/* POST apiv1/
             ======= */
router.post('/signup', function(req, res, next){
/*           ======= */

	var langsHandler = new LanguagesHandler(req);
	
	var email = req.body.email;
	var pass = req.body.pass;
	var rptpass = req.body.rptpass;
	var name = req.body.name;
	var user = new User({email: email, password: pass, nombre: name});

	if (pass !== rptpass) {
		res.json(new CustomError(CustomError.prototype._AUTH, langsHandler.traduction("Passwords do'nt match")));
		return;
	};

	user.save(function(err, createdUser){
		if (err) {
			if (err.name === 'MongoError') {
				res.status(400).json(new CustomError(CustomError.prototype._DDBB, langsHandler.traduction("Database Error"), err));
				return;
			}

			if (err.name === 'ValidationError') {
				res.status(400).json(new CustomError(CustomError.prototype._VALI, langsHandler.traduction(err.message), langsHandler.procesaMensajesValidacion(err.errors)));
				return;
			}
			
			res.status(400).json(null, err.message);
			return;
		}
	
		User.findOne(createdUser).select('-password').exec(function (err, cleanUser){

			var result = {success:true}
			result.usuario = cleanUser;
			res.json(result);
		})
	})
	
});

module.exports = router;