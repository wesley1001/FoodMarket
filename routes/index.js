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
var context = require('../instances/context.js');

var router = new Router();

/****************************
 登录过滤
 ***************************/
// todo: for test
router.use(function *(next) {

    context.set(this);
    // todo: for test
    var req = this.request;
    var user = yield auth.user(this);
    if (/\/user\/.*/.test(req.url)) {
        if (!user) {
            this.redirect('/wechat/login');
            return;
        } else if (user.status == -1) {
            this.redirect('/user-wait');
            return;
        } else if (user.status == -2) {
            this.redirect('/user-register');
            return;
        }
    }
    if (/\/adminer\/*/.test(req.url) && (util.isNullOrUndefined(user) ||  typeof user.type === 'undefined')) {
        this.redirect('/admin-login');
        return;
    }
    if (/\/adminer-(\w*)\/*/.exec(req.url)) {
        var type = /\/adminer-(\w*)\/*/.exec(req.url)[1];
        if ((util.isNullOrUndefined(user) ||  typeof user.type === 'undefined')) {
            this.redirect('/admin-login');
            return;
        }
        switch (type) {
            case 'super':
                if (user.type != 100) {
                    this.redirect('/admin-login');
                    return;
                }
                break;
        }
    }
    debug('next');
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
