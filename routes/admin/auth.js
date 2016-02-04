/**
 * Created by bian on 12/3/15.
 */
var debug = require('../../instances/debug');
var render = require('../../instances/render');
var db = require('../../models/index');
var auth = require('../../helpers/auth.js');
var Admins = db.models.Adminer;


module.exports = (router) => {

    router.get('/adminer/index', function *() {
        this.body = yield render('admin/index.html');
    });

    router.get('/admin-login', function *() {
        this.body = yield render('admin/login.html');
    });

    router.get('/admin-logout', function *() {
        yield auth.logout(this);
        this.redirect('admin-login');
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

            if (c != null && c.status == 0) {
                ///登陆
                auth.login(this, c, 0);
                this.redirect('/adminer/index');
            } else {
                this.redirect('/admin-login');
            }
        } catch (err) {
            this.redirect('/admin-login');
        }
    });

};