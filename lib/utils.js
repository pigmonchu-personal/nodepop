"use strict";

var NodepopUtils = class NodepopUtils {
     getParams(req) {
        var params = {};
        params.sort = req.query.sort || null;
        params.limit = +req.query.limit || null;
        params.skip = parseInt(req.query.skip) || 0;
        params.fields = req.query.fields || null;
        params.nombre = req.query.nombre;
        params.esVenta = req.query.venta ? req.query.venta.toUpperCase() : null;
        params.precio = req.query.precio;
        params.tags = req.query.tag;
        params.count = req.query.count ? (req.query.count.toUpperCase() === 'TRUE' ? true : null ): null;
        
        return params;
    }
} 

module.exports = NodepopUtils;