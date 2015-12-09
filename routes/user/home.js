var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

var sequelizex = require('../../lib/sequelizex.js');


var GoodsType = db.models.GoodsType;
var Goods = db.models.Goods;
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
        this.body = yield render('phone/index.html', {
            types: JSON.stringify(types)
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

    var goodsPerPage = 20;
    router.get('/:stype/goods/:page', getGoodsData);
    router.get('/goods-search/:txt/:page', getGoodsData);

    function *getGoodsData() {
        //this.checkParams('stype').notEmpty().isInt().toInt();
        this.checkParams('page').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var where;
        if (this.params.txt) {
            where = {
                title: {
                    $like: '%' + this.params.txt + '%'
                }
            };
        } else if (this.params.stype && /^\d*$/.test(this.params.stype)){
           where =  {
               GoodsTypeId: this.params.stype
           };
        }
        this.body = sequelizex.Func.val(yield Goods.findAll({
            where: where,
            offset: (this.params.page - 1) * goodsPerPage,
            limit: goodsPerPage,
            order: 'soldNum DESC'
        }));
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