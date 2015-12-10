// parties
var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');
var util = require('util');

var render = require('./../instances/render.js');
var db = require('./../models/index.js');
var debug = require('./../instances/debug.js');
var auth = require('../helpers/auth.js');

var router = new Router();

/****************************
 登录过滤
 ***************************/

// todo: for test
router.use(function *(next) {
    // todo: for test
    var req = this.req;
    var data;
    if (/\/user\/.*/.test(req.url)) {
        data = yield db.models.User.findOne();
    }
    if (/\/seller\/.*/.test(req.url)) {
        data = yield db.models.Seller.findOne();
    }
    if (/\/adminer\/*/.test(req.url)) {
        data = yield db.models.Adminer.findOne();
    }
    if (data) {
        auth.login(this, data);
    }
    var user = auth.user(this);
    if (/\/user\/.*/.test(req.url) && (util.isNullOrUndefined(user) || user.flag !== 1)) {
        this.redirect('/user-login');
        return;
    }
    if (/\/seller\/.*/.test(req.url) && (util.isNullOrUndefined(user) || user.flag !== 2)) {
        this.redirect('/user-login');
        return;
    }
    //if (/\/adminer\/*/.test(req.url) && (util.isNullOrUndefined(user) || user.flag !== 0)) {
    //    this.redirect('/user-login');
    //    return;
    //}
    debug('admin');
    yield next;
});

/****************************/

var loadDir = (dir) => {
    fs
        .readdirSync(dir)
        .forEach( (file) => {
            var nextPath = path.join(dir, file);
            var stat = fs.statSync(nextPath);
            if (stat.isDirectory()) {
                loadDir(nextPath);
            } else if (stat.isFile() && file.indexOf('.') !== 0 && file !== 'index.js') {
                require(nextPath)(router);
            }
        });
};

loadDir(__dirname);


// todo: for test
router.get('/view', function *() {
    debug('start render views');
    this.body = yield render('admin/index.html');
});


//todo: for validate and test and redirect
router.get('/seller/login',function *(){
   debug('start render seller login');
    this.body = yield render('seller/login.html');
});

module.exports = router.middleware();
