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

module.exports = router;