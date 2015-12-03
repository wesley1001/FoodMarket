var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Seller = db.models.Seller;

    router.get('/adminer/seller-check-list',  function *() {

        var sellers = yield Seller.findAll({
            where: {
                status: -1
            }
        });
        this.body = yield render('admin/goodstype/list.html', {
            sellers
        });
    });

};