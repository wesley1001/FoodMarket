var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug');

module.exports = (router) => {

    var Goods = db.models.Goods;
    var GoodsType = db.models.GoodsType;

    router.get('/adminer/goods/save',  saveView);
    router.get('/adminer/goods/save/:id',  saveView);

    router.post('/adminer/goods/save',  save);
    router.post('/adminer/goods/save/:id',  save);

    function *saveView() {
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
        this.checkBody('oldPrice').notEmpty().isFloat().gt(0).toFloat();
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
                goods.oldPrice = body.oldPrice;
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
                oldPrice: body.oldPrice,
                capacity: body.capacity,
                discount: typeof body.discount === 'undefined',
                SellerId: auth.user(this).id,
                GoodsTypeId: body.GoodsTypeId,
                soldNum: 0,
                content: body.content
            });
        }

        this.body = 'ok';
    }

    router.get('/adminer/goods',function *(){
        this.body = yield render('goods/list.html',{
        });
    });

    router.get('/adminer/goods/:status',function *(){
        this.checkParams('status').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        this.body = yield Goods.findAll({
            where: {
                status: this.params.status
            },
            attributes: [
                'id', 'price', 'mainImg', 'soldNum', 'capacity', 'title', 'status',
                'oldPrice',
                'vipDiscount'
            ],
            include: [GoodsType]
        });
    });

    router.post('/adminer/goods/action',function *(){
        this.checkBody('id').notEmpty().isInt().toInt();
        this.checkBody('status').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var body = this.request.body;
        yield Goods.update({
            status: body.status
        }, {
            where: {
                id: body.id
            }
        });

        if (body.status != 0 ){
            // 购物车清理
            yield db.models.ShoppingCart.destory({
                where: {
                    GoodId:  body.id
                }
            });
        }

        this.body = {
            status: true
        };
    });

    router.get('/adminer/goods/all',function *(){
        var goods = yield Goods.findAll({
            attributes: ['id','title', 'price','soldNum','content']
        });
        console.log(JSON.stringify(goods));
        this.body = JSON.stringify(goods);
    });

    router.get('/adminer/goods/remove/:id',function *(){
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

};