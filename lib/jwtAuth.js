'use strict';

/**
 * Your utility library for express
 */

var jwt = require('jsonwebtoken');
var config = require('config');
var CustomError = require('./customError');

module.exports = function() {
    
    return function(req, res, next) {

        
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            jwt.verify(token, config.get('appKey'), function(err, decoded) {
                if (err) {
										return res.json(
											new CustomError(CustomError.prototype._AUTH, 'Failed to authenticate token')
										);

                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    console.log('decoded', decoded);
                    next();
                }
            });

        } else { 
            return res.status(403).json(
	            new CustomError(CustomError.prototype._AUTH, 'No token provided')
            );

        }
    };
};
