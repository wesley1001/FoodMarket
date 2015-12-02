var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Goods = db.models.Goods;

    router.get('/seller/create-goods', function *() {
        this.body = yield render('seller/goods/create.html', {

        });
    });

};