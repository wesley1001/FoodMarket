/**
 * Created by lxc on 15-12-10.
 */
var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {

    var Orders = db.models.Order;
    var OrderItem = db.models.OrderItem;

    router.get('/adminer/orders',  function *() {
        var orders = yield Orders.findAll({
            offset: 35,
            limit: 5,
            include: [OrderItem]

        });
        debug(orders);
        this.body = yield render('admin/orders', {
            orders
        });
    });

};