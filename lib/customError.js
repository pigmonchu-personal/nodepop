"use strict";

var config = require('config');

var CustomError = class CustomError {
	
	constructor(type, message, info) {
//		this.translator = null;
		this.success = false;
		this.error = {};
			
		if (type < this.errorTypes.length) {
			this.error.name = this.errorTypes[type];
		} else {
			this.error.name = 'Error';
		}

		this.error.message = message;
		
		if (info) {
			this.error.aditionalInfo = info;
		}
 		console.log('creado CustomError => [' + this.error.name +']');
	}
	
	process(err, withInfo) {
		this.error.name = err.name;
		if (this.translator) {
			this.error.message = this.translator.__(err.message);
		} else {
			this.error.message = err.message;
		}
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