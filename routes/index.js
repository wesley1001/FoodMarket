// parties
var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');

var db = require('./../models/index.js');

var router = new Router();

fs
    .readdirSync(__dirname)
    .filter( (file) => {
        return file.indexOf('.') !== 0 &&
            file !== 'index.js';
    })
    .forEach( (file) => {
        require(path.join(__dirname, file))(router);
    });

module.exports = router.middleware();
