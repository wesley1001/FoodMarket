var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug');

var Sequelize = require('sequelize');

module.exports = (router) => {

    var Goods = db.models.Goods;
    var GoodsType = db.models.GoodsType;

    router.get('/seller/goods/save',  get);
    router.get('/seller/goods/save/:id',  get);

    router.post('/seller/goods/save',  save);
    router.post('/seller/goods/save/:id',  save);

    function *get() {
        var types = yield GoodsType.findAll({
            where: {
                type: 1
            },
            attributes: ['title', 'type', 'id'],
            include: [GoodsType]
        });
        types = types.map(function (item) {
            return item.dataValues;
        });

        var data;
        if (this.params.id ){
            data = yield Goods.findById(this.params.id);
            data = data.dataValues;
            data.discount = data.discount ? 'checked' : '';
        }

        this.body = yield render('goods/save.html', {
            types: JSON.stringify(types),
            data: data
        });
    }

    function *save() {
        this.checkBody('title').notEmpty();
        this.checkBody('mainImg').notEmpty();
        this.checkBody('imgs').notEmpty();
        this.checkBody('price').notEmpty().isFloat().gt(0).toFloat();
        this.checkBody('capacity').notEmpty().isInt().gt(0).toInt();
        this.checkBody('GoodsTypeId').notEmpty().isInt().toInt();

        var body = this.request.body;

        if (this.errors) {
            this.body = this.errors;
            return;
        }

        yield Goods.create({
            title: body.title,
            mainImg: body.mainImg,
            imgs: body.imgs,
            price: body.price,
            capacity: body.capacity,
            discount: typeof body.discount === 'undefined',
            SellerId: auth.user(this).id,
            GoodsTypeId: body.GoodsTypeId,
            status: -1,
            soldNum: 0,
            content: body.content
        });

        this.body = 'ok';
    }

};