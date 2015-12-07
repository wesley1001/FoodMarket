var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

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

    router.get('/:stype/goods', function *() {
        this.checkParams('stype').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        this.body = sequelizex.Func.val(yield Goods.findAll({
            where: {
                GoodsTypeId: this.params.stype
            }
        }));

    });

    router.get('/user/shoppingcart/:id/:num', function *() {
        this.checkParams('id').notEmpty().isInt().toInt();
        this.checkParams('num').notEmpty().isInt().gt(0).toInt();
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
            shoppingCart.num = this.params.num;
            yield shoppingCart.save();
        } else {
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

};