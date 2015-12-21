/**
 * Created by bian on 12/3/15.
 */

var verifyCode = require('../../helpers/verifyCode');
var debug = require('../../instances/debug');
var render = require('../../instances/render');
var db = require('../../models/index');
var auth = require('../../helpers/auth.js');
var Admins = db.models.Adminer;

module.exports = (router) => {


    router.get('/adminer/index', function *() {
        this.body = 'hello';
    });


    router.get('/admin-login', function *() {
        this.body = yield render('admin/login.html');
    });

    // todo: redirect
    router.post('/admin-login', function *() {
        var ctx = this;
        var body = this.request.body;
        this.checkBody('nickname').notEmpty();
        this.checkBody('password').notEmpty();
        if (this.errors) {
            return;
        }
        try {

            var c = yield Admins.findOne({
                where: {
                    nickname: body.nickname,
                    password: body.password,
                    status: 0
                }
            });

            if (c!=null && c.status == 0) {
                ///登陆
                auth.login(this, c);
                this.redirect('/adminer/index');
            } else {
                this.redirect('/admin-login');
            }
        } catch (err) {
            this.redirect('/admin-login');
        }
    });

    router.get('/verifyCode/:phone', function *() {
        this.checkParams('phone').notEmpty();
        this.checkParams('phone').match(/^1[3-8]+\d{9}$/);
        if (this.errors) {
            this.body = -1;
            return;
        }
        var code = yield verifyCode.send(this.params.phone);
        this.body = code;
    });

    router.get('/verifyCode', function *() {
        this.checkQuery('phone').notEmpty();
        this.checkQuery('phone').match(/^1[3-8]+\d{9}$/);
        this.checkQuery('code').notEmpty();
        this.checkQuery('code').optional().len(6);
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var result = yield verifyCode.verify(this.query.phone, this.query.code);
        this.body = result;
    });

};