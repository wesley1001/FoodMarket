var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {

    var Goods=db.models.Goods;
    var Order = db.models.Order;
    var OrderItem = db.models.OrderItem;


    router.get('/adminer/order-list',  function *() {

        var goods = yield Goods.findAll({
            where: {
                status: 0
            },
            attributes: ['id', 'title']
        });

        this.body = yield render('order/list', {
            goods
        });

    });

    router.post('/adminer/get-order', function *() {

        //this.checkBody('status').notEmpty().isInt().toInt();
        //this.checkBody('startDate').optional().isDate();
        //this.checkBody('endDate').optional().isDate();

        if (this.errors) {
            this.body = this.errors;
            return;
        }

        var body = this.request.body;

        if (!body.page || body.page < 0) {
            body.page = 1;
        }
        body.page = parseInt(body.page);

        if (!body.limit || body.limit < 0) {
            body.limit = 25;
        }
        body.limit = parseInt(body.limit);

        var conditions = {
            where: {
                status: body.status ? body.status : {
                    in: [1,2,3]
                }
            },
            include: [],
            offset: (body.page - 1) * body.limit,
            limit: body.limit
        };

        if (body.startDate) {
            conditions.where.payTime = {
                between: [new Date(Date.parse(body.startDate)), body.endDate ? new Date(Date.parse(body.endDate)) : new Date(Date.now())]
            }
        }

        if (body.recieverName) {
            conditions.where.recieverName = body.recieverName;
        }

        if (body.phone) {
            conditions.where.phone = body.phone;
        }
        debug(body.goodsIds);
        if (body.goodsIds) {
            conditions.include.push({
                model: OrderItem,
                //where: {
                //    GoodId: body.goodsIds[0]
                //}
            });
        }

        debug(conditions);
        var num = 0;
        if (body.first) {
            num= yield Order.count(conditions);
        }

        var orders = yield Order.findAll(conditions);

        this.body = {
            num,
            orders
        };
    });

    router.get('/adminer/get-orderitem/:id', function *() {

        this.body = (yield OrderItem.findAll({
            where: {
                OrderId: this.params.id
            }
        })).map(function (item) {
            item.goods = JSON.parse(item.goods);
            return item;
        });
    });

};