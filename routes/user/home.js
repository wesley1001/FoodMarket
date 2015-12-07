var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {


    router.get('/user/index',  function *() {
        this.body = yield render('phone/index.html', {
        });
    });

    router.get('/user/goods',  function *() {
        this.body = yield render('phone/goods.html', {
        });
    });

};