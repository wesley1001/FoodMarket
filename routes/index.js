// parties
var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');

var render = require('./../instances/render.js');
var debug = require('./../instances/debug.js');

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

// todo: for test
router.get('/view', function *() {
    debug('start render views');
    this.body = yield render('admin/index.html');
    console.log(this.body);
});

module.exports = router.middleware();
