/**
 * Created by nobody on 2015/12/9.
 */
var Sequelize = require('sequelize');
var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

var sequelizex = require('../../lib/sequelizex.js');


var GoodsType = db.models.GoodsType;
var Goods = db.models.Goods;
var ShoppingCart = db.models.ShoppingCart;
var DeliverAddress = db.models.DeliverAddress;
var Order = db.models.Order;
var OrderItem = db.models.OrderItem;

module.exports = function (router) {

    router.post('/user/order-comfirm', function *() {

        this.checkBody('ids').notEmpty();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var body = this.request.body;
        var ids = JSON.parse(body.ids);
        var order = yield ShoppingCart.findAll({
            where: {
                UserId: auth.user(this).id,
                id: {
                    $in: ids
                }
            },
            attributes: ['id', 'num', 'GoodId'],
            include: [{
                model: db.models.Goods,
                attributes: ['SellerId', 'price', 'title', 'mainImg'],
                include: [{
                    model: db.models.Seller,
                    attributes: ['shopName']
                }]
            }]
        });

        var addresses = yield DeliverAddress.my(auth.user(this).id);

        this.body = yield render('phone/order-comfirm.html', {
            title: '订单确认',
            order: JSON.stringify(order),
            addresses: JSON.stringify(addresses)
        });
    });

    router.post('/user/buy', function *() {

        this.checkBody('order').notEmpty();
        this.checkBody('address').notEmpty();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var body = this.request.body;
        var orderInfo = JSON.parse(body.order);
        var addressId = body.address;
        var userId = auth.user(this).id;

        var address = yield DeliverAddress.findOne({
            where: {
                id: addressId,
                UserId: auth.user(this).id
            }
        });

        if (!address) {
            this.body = 'invalid address';
            return;
        }
        address = address.dataValues;

        var ids = [];
        orderInfo.forEach(function (shop) {
            shop.goods.forEach(function (goods) {
                ids.push(goods.id)
            });
        });
        var shoppingCart = yield ShoppingCart.findAll({
            where: {
                UserId: auth.user(this).id,
                id: {
                    $in: ids
                }
            },
            attributes: ['id', 'num', 'GoodId'],
            include: [Goods]
        });

        yield db.transaction(function (t) {
            var promise;
            var orders = [];
            orderInfo.forEach(function (shop) {
                var price = 0;
                var orderItems = shop.goods.map(function (item) {
                    var goods = shoppingCart.filter(function (goods) {
                        return goods.id === item.id
                    })[0];
                    if (item.num === goods.num) {
                        if (promise) {
                            promise = promise.then(function () {
                                return goods.destroy({transaction: t});
                            }, {transaction: t});
                        } else {
                            promise = goods.destroy({transaction: t});
                        }
                    } else if(item.num < goods.num){
                        goods.num -= item.num;
                        if (promise) {
                            promise = promise.then(function () {
                                return goods.save({transaction: t});
                            }, {transaction: t});
                        } else {
                            promise = goods.save({transaction: t});
                        }
                    } else {
                        throw "invalid num";
                    }
                    price += item.num * goods.Good.price;

                    return OrderItem.build({
                        goods: JSON.stringify({
                            title: goods.Good.title,
                            price: goods.Good.price,
                            mainImg: goods.Good.mainImg,
                            id: goods.Good.id,
                            discount: goods.Good.discount
                        }),
                        price: item.num * goods.Good.price,
                        num: item.num,
                        GoodId: goods.Good.id
                    });
                });
                promise = promise.then(function () {
                    return Order.create({
                        address: JSON.stringify(address),
                        price,
                        num: orderItems.length,
                        status: 0,
                        message: shop.msg,
                        UserId: userId,
                        SellerId: shop.id
                    });
                }, {transaction: t});
                for(var i in orderItems) {
                    var orderItem = orderItems[i];
                    (function (orderItem) {
                        promise = promise.then(function (data) {
                            orderItem.OrderId = data.id;
                            return orderItem.save({transaction: t}).then(function () {
                                return data.id;
                            });
                        });
                    }(orderItem));
                }
            });
            return promise;
        });

        // todo: pay
        this.body = 'finished';
    });

    router.get('/user/order-list/:status/:page', function *() {
        this.checkParams('status').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var userId = auth.user(this).id;
        var order = yield Order.findAll({
            where: {
                UserId: userId,
                status: this.params.status
            }
        });

        this.body = yield render('phone/order-list', {
            title: '订单',

        });
    });

};