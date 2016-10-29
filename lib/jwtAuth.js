'use strict';

/**
 * Your utility library for express
 */

var jwt = require('jsonwebtoken');
var config = require('config');

module.exports = function() {

    return function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
//            jwt.verify(token, configJWT.secret, function(err, decoded) {
            jwt.verify(token, config.get('appKey'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, error: {name: 'invalid token', message: 'Failed to authenticate token.'}});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    console.log('decoded', decoded);
                    next();
                }
            });

        } else {

            // if there is no token return error
            return res.status(403).json({
                ok: false,
                error: { name: 'No token', message: 'No token provided.'}
            });

        }
    };
};
