"use strict";

var config = require('config');
var i18n = require('i18n-nodejs')(config.get('language'), config.get('langFile'));

var CustomError = class CustomError {
	
	constructor(type, message, info) {

		this.success = false;
		this.error = {};
			
		if (type < this.errorTypes.length) {
			this.error.name = this.errorTypes[type];
		} else {
			this.error.name = 'Error';
		}
		
		this.error.message = i18n.__(message);
		
		if (info) {
			this.error.aditionalInfo = info;
		}
 		console.log('creado CustomError => [' + this.error.name +']');
	}
	
	process(err, withInfo) {
		this.error.name = err.name;
		this.error.message = i18n.__(err.message);
		if (withInfo) {
			this.error.info = err;
		}
	}
	
	status(value) {
		this.status = value;
	} 
}

CustomError.prototype._AUTH = 0;
CustomError.prototype._VALI = 1;
CustomError.prototype._DDBB = 2;
CustomError.prototype.errorTypes = ['AuthenticationError', 'ValidationError', 'MongoError']; 

module.exports = CustomError;