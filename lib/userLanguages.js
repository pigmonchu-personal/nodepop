"use strict";

var config = require('config');
var accepts = require('accepts');
var i18n = require('i18n-nodejs');

var Languages = config.get('userLanguages');
var _LANGUAGES = [];

for (var lg in Languages) {
	if (Languages.hasOwnProperty(lg)) {
		_LANGUAGES.push(lg);
	}
}

var LanguagesHandler = class LanguagesHandler {
	constructor(req) {
		var accept = accepts(req);
		this.fixLang(req);
		
		this.language = accept.language(_LANGUAGES) || config.get("defaultLanguage");

		this.translator = i18n(this.language, config.get('langFile'));

	}
};

LanguagesHandler.prototype.fixLang =  function(req) {
	var accept = accepts(req);
	this.language = accept.language(_LANGUAGES) || 'en';

 	this.translator = i18n('es', config.get('langFile'));

};

LanguagesHandler.prototype.traduction = function(msg) {
	return this.translator.__(msg);
};

module.exports = LanguagesHandler;
