/**
 * Created by nobody on 2015/12/9.
 */
var Sequelize = require('sequelize');
var util = require('util');
var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');
var co = require('co');

var sequelizex = require('../../lib/sequelizex.js');


var Container = db.models.Container;
var Area = db.models.Area;
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
                attributes: ['price', 'title', 'mainImg', 'oldPrice', 'brief', 'vipDiscount']
            }]
        });

        var addresses = yield DeliverAddress.findAll({
            where: {
                UserId: auth.user(this).id
            },
            include: [Area]
        });

        var fare = yield Container.fare();
        this.body = yield render('phone/order-comfirm.html', {
            title: '订单确认',
            order: JSON.stringify(order),
            addresses: JSON.stringify(addresses),
            fare: JSON.stringify(fare)
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

        var fare = yield Container.fare();

        if (!address) {
            this.body = 'invalid address';
            return;
        }

        var ids = orderInfo.map(function (item) {
            return item.id;
        });
        debug(ids);
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

            return co(function *() {
                var orderItems = [];
                for(var i in orderInfo) {
                    var buyItem = orderInfo[i];
                    var price = 0;
                    var shoppingCartItem = shoppingCart.filter(function (item) {
                        return item.id === buyItem.id
                    })[0];
                    if (util.isNullOrUndefined(shoppingCartItem)){
                        throw 'invalid op';
                    }
                    if (buyItem.num === shoppingCartItem.num) {
                        yield shoppingCartItem.destroy({transaction: t});
                        //if (promise) {
                        //    promise = promise.then(function () {
                        //        return shoppingCartItem.destroy({transaction: t});
                        //    }, {transaction: t});
                        //} else {
                        //    promise = shoppingCartItem.destroy({transaction: t});
                        //}
                    } else if(buyItem.num < shoppingCartItem.num){
                        shoppingCartItem.num -= item.num;
                        yield shoppingCartItem.save({transaction: t});
                        //if (promise) {
                        //    promise = promise.then(function () {
                        //        return goods.save({transaction: t});
                        //    }, {transaction: t});
                        //} else {
                        //    promise = goods.save({transaction: t});
                        //}
                    } else {
                        throw "invalid num";
                    }
                    price += buyItem.num * shoppingCartItem.Good.price;

                    orderItems.push(OrderItem.build({
                        goods: JSON.stringify(shoppingCartItem),
                        price: buyItem.num * shoppingCartItem.Good.price,
                        num: buyItem.num,
                        GoodId: shoppingCartItem.Good.id
                    }));
                    shoppingCartItem.Good.capacity --;
                    shoppingCartItem.Good.soldNum ++;
                    yield shoppingCartItem.Good.save({transaction: t});
                };

                var orderFare = 0;
                if (price < fare.freeLine) {
                    orderFare = fare.basicFare;
                    price += orderFare;
                }
                var order = yield Order.create({
                    recieverName: address.recieverName,
                    phone: address.phone,
                    province: address.province,
                    city: address.city,
                    area: address.area,
                    address: address.address,
                    price,
                    num: orderItems.length,
                    status: 0,
                    fare: orderFare,
                    message: body.msg ? body.msg : '',
                    UserId: userId
                }, {transaction: t});

                for(var i in orderItems) {
                    var orderItem = orderItems[i];
                    orderItem.OrderId = order.id;
                    yield orderItem.save({transaction: t});
                }
                //promise = promise.then(function () {
                //    return Order.create({
                //        address: JSON.stringify(address),
                //        price,
                //        num: orderItems.length,
                //        status: 0,
                //        message: shop.msg,
                //        UserId: userId,
                //        SellerId: shop.id
                //    });
                //}, {transaction: t});
                //for(var i in orderItems) {
                //    var orderItem = orderItems[i];
                //    (function (orderItem) {
                //        promise = promise.then(function (data) {
                //            orderItem.OrderId = data.id;
                //            return orderItem.save({transaction: t}).then(function () {
                //                return data.id;
                //            });
                //        });
                //    }(orderItem));
                //}
            });

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