// parties
var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');
var util = require('util');

var render = require('./../instances/render.js');
var debug = require('./../instances/debug.js');
var auth = require('../helpers/auth.js');

var router = new Router();

/****************************
 登录过滤
 ***************************/
router.use('/user/*', function *() {
    var user = auth.user();
    if (util.isNullOrUndefined(user) || user.flag !== 1) {
        this.redirect('/user-login');
        return;
    }
    yield next;
});

router.use('/seller/*', function *() {
    var user = auth.user();
    if (util.isNullOrUndefined(user)  || user.flag !== 2) {
        this.redirect('/seller-login');
        return;
    }
    yield next;
});

router.use('/adminer/*', function *() {
    var user = auth.user();
    if (util.isNullOrUndefined(user) || user.flag !== 0) {
        this.redirect('/adminer-login');
        return;
    }
    yield next;
});
/****************************/

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
