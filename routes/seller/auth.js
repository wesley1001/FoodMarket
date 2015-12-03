/**
 * Created by bian on 12/3/15.
 */

var verifyCode = require('../../helpers/verifyCode');
var debug = require('../../instances/debug');
//todo: for validate and test and redirect
module.exports = (router) => {
    router.get('/seller/login', function *() {
        debug('start render seller login');
        this.body = yield render('seller/login.html');
    });

    router.get('/verifyCode/:phone', function *() {
        this.checkParams('phone').notEmpty();
        this.checkParams('phone').match(/^1[3-8]+\d{9}$/);
        if(this.errors){
            debug(this.errors);
            return;
        }
        var code = yield verifyCode.send(this.params.phone);
        debug(code);
        this.body = code;
    });

    router.get('/verifyCode/:phone/:code', function *() {
        this.checkParams('phone').notEmpty();
        this.checkParams('code').notEmpty();
        if(this.errors){
            debug(this.errors);
            return;
        }
        var result = yield verifyCode.verify(this.params.phone, this.params.code);
        this.body = result;
    });
};