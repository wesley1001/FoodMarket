var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Goods = db.models.Goods;

    router.get('/seller/goods/save',  get);
    router.get('/seller/goods/save/:id',  get);

    function *get() {
        this.body = yield render('goods/save.html', {
        });
    }

};