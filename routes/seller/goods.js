var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var Goods = db.models.Goods;

module.exports = (router) => {

    var Goods = db.models.Goods;

    router.get('/seller/goods/save',  get);
    router.get('/seller/goods/save/:id',  get);

    function *get() {
        this.body = yield render('goods/save.html', {
        });
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