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

        var isCreate = true;
        if (body.id) {
            var goods = yield Goods.findById(body.id);
            if (goods != null) {
                goods.title = body.title;
                goods.mainImg = body.mainImg;
                goods.imgs = body.imgs;
                goods.price = body.price;
                goods.capacity = body.capacity;
                goods.discount = Boolean(body.discount);
                goods.GoodsTypeId = body.GoodsTypeId;
                goods.content = body.content;
                yield goods.save();
                isCreate = false;
            }
        }

        if (isCreate) {
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
        }

        this.body = 'ok';
    }

    router.get('/seller/goods/list',function *(){
        this.body = yield render('seller/goods-list.html',{
        });

    });

    router.get('/seller/goods/all',function *(){
        var goods = yield Goods.findAll({
            attributes: ['id','title', 'price','soldNum','content']
        });
        console.log(JSON.stringify(goods));
        this.body = JSON.stringify(goods);
    });

    router.get('/seller/goods/remove/:id',function *(){
        var id = this.params.id;
        try {
            yield Goods.destroy({
                where: {
                    id: id
                }
            });
            this.body = '1';
        }catch(err){
            this.body = '0';
            console.log(error);
        }
    });

    router.get('/seller/goods/fortest/add/',function *(){
        var sellerid = 1;
        data = {
            title:"this is a test",
            mainImg:"http://baidu.com/baidu.icon",
            imgs:"{}",
            price:100,
            soldNum:100,
            capacity:10,
            content:"this is a test",
            discount:false,
            status:-1,
            SellerId:1,
            GoodTypeId:2
        };

        yield Goods.create(data);
        this.body = "1";
    });

};