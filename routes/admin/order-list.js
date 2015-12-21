var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');
var xlsx = require('node-xlsx');
var fs = require('fs');

var excelbuilder = require('msexcel-builder');

module.exports = (router) => {

    var Goods=db.models.Goods;
    var Order = db.models.Order;
    var OrderItem = db.models.OrderItem;
    var Area = db.models.Area;

    router.get('/adminer/order-list',  function *() {

        var goods = yield Goods.findAll({
            where: {
                status: 0
            },
            attributes: ['id', 'title']
        });

        var areas = yield Area.findAll({
            where: {
                type: 1
            }
        });

        this.body = yield render('order/list', {
            goods,
            areas
        });

    });

    router.post('/adminer/get-order', function *() {

        //this.checkBody('status').notEmpty().isInt().toInt();
        //this.checkBody('startDate').optional().isDate();
        //this.checkBody('endDate').optional().isDate();

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
            include: [{
                model: Area,
                //as: 'SArea',
            }],
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
        if (body.goodsIds) {
            conditions.include.push({
                model: OrderItem,
                where: {
                    GoodId: body.goodsIds[0]
                }
            });
        }

        if (body.areas) {
            conditions.include[0].where ={
                TopAreaId: {
                    in: body.areas
                }
            };
        }

        var num = 0;
        if (body.first) {
            num= yield Order.count(conditions);
        }

        conditions.include[0].include =[{
            model: Area,
            as: 'TopArea'
        }];

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

    router.post('/adminer/order/status', function *() {

        this.checkBody('ids').notEmpty();
        this.checkBody('status').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            return;
        }

        var body = this.request.body;

        debug(body);

        this.body = yield Order.update({
            status: 2,
            sendTime: Date.now()
        },{
            where: {
                id: {
                    in: body.ids
                },
                status: 1
            }
        });
    });

    router.post('/adminer/order/export', function *() {

        this.checkBody('ids').notEmpty();
        this.checkBody('type').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var body = this.request.body;

        body.ids = JSON.parse(body.ids);

        var orders = yield Order.findAll({
            where: {
                id: {
                    in: body.ids
                }
            },
            include: [
                {
                    model: OrderItem
                },
                {
                    model: Area,
                    include: [
                        {
                            model: Area,
                            as: 'TopArea'
                        }
                    ]
                },
            ]
        });

        var totalRow = 100;
        var totalCol = 100;
        orders.forEach(function (item) {
            totalRow += item.num;
        });
        var workbook = excelbuilder.createWorkbook('./', 'orders.xlsx');

        var sheet = workbook.createSheet('shhet1', totalCol, totalRow);
        // set title

        var titles = body.type == 'all' ? [
            '订单号',
            '收货人姓名',
            '收货人手机号',
            '区域',
            '地址',
            '数量',
            '总价',
            '运费',
            '支付时间',
            '订单状态',
            '备注',
            '商品id',
            '标题',
            '单价',
            '总价',
            '数量'
        ] : [
            '订单号',
            '数量',
            '总价',
            '备注',
            '商品id',
            '标题',
            '数量'
        ];

        titles.forEach(function (str, index) {
            sheet.set(index + 1, 1, str);
        });
        //body.type == 'all' ?
        var attrs = body.type == 'all' ? [
            'id',
            'recieverName',
            'phone',
            (obj) => {
                return obj.Area.TopArea.title + '-' + obj.Area.title;
            },
            (obj) => {
                return obj.province + obj.city + obj.area + obj.address;
            },
            'num',
            'price',
            'fare',
            'payTime',
            (obj) => {
                var val = obj.status;
                switch (val) {
                    case 0:
                        return '';
                    case 1:
                        return '待发货';
                    case 2:
                        return '已发货';
                    case 3:
                        return '已签收';
                }
            },
            'message'
        ] : [
            'id',
            'num',
            'price',
            'message'
        ];

        var itemAttrs = body.type == 'all' ? [
            'GoodId',
            (obj) => {
                return obj.goods.title;
            },
            (obj) => {
                return obj.goods.price;
            },
            'price',
            'num'
        ] : [
            'GoodId',
            'num'
        ];

        var rowCounter = 2;
        orders.forEach(function (order) {
            var colCounter = 1;
            attrs.forEach((item) => {
                var val;
                if (typeof item === 'function') {
                    val = item(order);
                } else {
                    val = order[item];
                }
                sheet.set(colCounter ++, rowCounter, val);
            });

            for(var i = 1; i < colCounter; i ++) {
                sheet.merge(
                    {col: i,row: rowCounter},
                    {col: i,row: rowCounter + order.num}
                );
            }
            var tmpCol = colCounter;
            order.OrderItems.forEach((orderItem)=> {
                colCounter = tmpCol;
                orderItem.goods = JSON.parse(orderItem.goods);
                itemAttrs.forEach((item) => {
                    var val;
                    if (typeof item === 'function') {
                        val = item(orderItem);
                    } else {
                        val = orderItem[item];
                    }
                    sheet.set(colCounter ++, rowCounter, val);
                });
                rowCounter ++;
            });

            rowCounter += 1;
        });


        //this.body = 'ok';

        this.response.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        var ctx = this;
        var jszip = workbook.generate(function (err, jszip) {
            return jszip;
        });
        var buffer = jszip.generate({type: "nodebuffer"});
        this.response.set('Content-Disposition', 'attachment;filename=order.xlsx');
        this.body = buffer;
    });


};