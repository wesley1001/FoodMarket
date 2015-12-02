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

router.use(function *(next) {
    // todo: for test
    var req = this.req;
    var data;
    if (/\/user\/*/.test(req.url)) {
        data = yield db.models.User.findOne();
        if (util.isNullOrUndefined(data)) {
            data = yield db.models.User.create({
                name: 'user',
                nickname: 'user nickname',
                headimage: 'http://git.oschina.net/uploads/57/91357_liaozhijie.jpg?1427730792',
                password: '123456',
                sex: 1,
                phone: '18840823910',
                unionid: '123',
                openid: '123',
                status: 0
            });
        }
    }
    if (/\/seller\/*/.test(req.url)) {
        data = yield db.models.Seller.findOne();
        if (util.isNullOrUndefined(data)) {
            data = yield db.models.Seller.create({
                name: 'user',
                password: '123456',
                phone: '18840823910',
                address: '123',
                shopName: '123',
            });
        }
    }
    if (/\/adminer\/*/.test(req.url)) {
        data = yield db.models.Adminer.findOne();
        if (util.isNullOrUndefined(data)) {
            data = yield db.models.Adminer.create({
                name: 'user',
                password: '123456',
                phone: '18840823910',
            });
        }
    }
    auth.login(this, data);
    var user = auth.user(this);

    if (/\/user\/*/.test(req.url) && (util.isNullOrUndefined(user) || user.flag !== 1)) {
        this.redirect('/user-login');
        return;
    }
    if (/\/seller\/*/.test(req.url) && (util.isNullOrUndefined(user) || user.flag !== 2)) {
        this.redirect('/user-login');
        return;
    }
    if (/\/adminer\/*/.test(req.url) && (util.isNullOrUndefined(user) || user.flag !== 0)) {
        this.redirect('/user-login');
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
});

module.exports = router.routes();
