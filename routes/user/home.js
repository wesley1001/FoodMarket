var Sequelize = require('sequelize');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

var sequelizex = require('../../lib/sequelizex.js');


var GoodsType = db.models.GoodsType;
var Goods = db.models.Goods;
var Seller = db.models.Seller;
var ShoppingCart = db.models.ShoppingCart;


module.exports = (router) => {

    router.get('/user/index',  function *() {
        var types = yield GoodsType.findAll({
            where: {
                type: 1
            },
            attributes: ['title', 'type', 'id'],
            include: [GoodsType]
        });

        var area = yield Seller.findAll({
            attributes: [
                [Sequelize.literal('DISTINCT city'), 'city'],
                'country',
            ],
            where: {
                status: 0
            }
        });

        this.body = yield render('phone/index.html', {
            types: JSON.stringify(types),
            area: JSON.stringify(area)
        });
    });

    router.get('/user/goods',  function *() {
        this.body = yield render('phone/goods.html', {
        });
    });

    router.get('/all-ltype', function *() {
        var types = yield GoodsType.allLtype();
        this.body = types;
    });

    var goodsPerPage = 3;
    router.post('/get-goods', getGoodsData);
    //router.get('/goods-search/:txt/:page', getGoodsData);

    function *getGoodsData() {

        this.checkBody('page').notEmpty().isInt().toInt();
        this.checkBody('city').notEmpty();
        //this.checkBody('country').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var body = this.request.body;
        var ids = (yield Seller.findAll({
            where: body.country ?{
                city: body.city,
                country: body.country
            } : {
                city: body.city
            },
            attributes: ['id']
        })).map(function (item) {
            return item.id;
        });
        var where;
        if (body.txt) {
            where = {
                title: {
                    $like: `%${body.txt.trim()}%`
                },
                SellerId: {
                    $in: ids
                }
            };
        } else if (body.stype && /^\d*$/.test(body.stype)){
           where =  {
               GoodsTypeId: body.stype,
               SellerId: {
                   $in: ids
               }
           };
        }
        this.body = yield Goods.findAll({
            where: where,
            offset: (body.page - 1) * goodsPerPage,
            limit: goodsPerPage,
            order: [['soldNum', 'DESC'], 'title']
        });
    }

    router.get('/user/shoppingcart/:id/:num', function *() {
        this.checkParams('id').notEmpty().isInt().toInt();
        this.checkParams('num').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var shoppingCart = yield ShoppingCart.findOne({
           where:{
               UserId: auth.user(this).id,
               GoodId: this.params.id
           }
        });
        if (shoppingCart) {
            if (this.params.num >= 0 ) {
                shoppingCart.num = this.params.num;
                yield shoppingCart.save();
            } else {
                yield shoppingCart.destroy();
            }
        } else if (this.params.num >= 0){
            yield ShoppingCart.create({
                UserId: auth.user(this).id,
                GoodId: this.params.id,
                num: this.params.num
            });
        }
        this.body = 'ok';
    });

    router.get('/user/shoppingcart', function *() {
        this.body = sequelizex.Func.val(yield ShoppingCart.findAll({
            where: {
                UserId: auth.user(this).id
            },
            attributes: ['id', 'num', 'GoodId']
        }));
    });

    router.get('/user/goods-page/:id', function *() {
        this.checkParams('id').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var goods = yield Goods.findById(this.params.id);
        goods.seller = yield goods.getSeller();
        goods.imgs = JSON.parse(goods.imgs);
        var shoppingCart = yield ShoppingCart.findOne({
            where:{
                UserId: auth.user(this).id,
                GoodId: this.params.id
            }
        });
        goods.num = shoppingCart ? shoppingCart.num : 0;
        this.body = yield render('phone/goods.html', {
            title: '商品:' + goods.title,
            goods: goods
        });
    });

    router.get('/user/shoppingcart-view', function *() {

        var shoppingCart = yield sequelizex.Func.val(yield ShoppingCart.findAll({
            where: {
                UserId: auth.user(this).id
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
        }));
        this.body = yield render('phone/shoppingCart.html', {
            title: '购物车',
            shoppingCart: JSON.stringify(shoppingCart)
        });
    });

};