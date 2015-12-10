var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {

    var GoodsType = db.models.GoodsType;

    router.get('/adminer/goodstype',  function *() {
        var types = yield GoodsType.all();
        debug(types);
        this.body = yield render('admin/goodstype', {
            types
        });
    });


    router.get('/adminer/addtype',  function *() {

        if(this.query.type!=1){
            this.checkQuery('fid').toInt(0);
        }
        this.checkQuery('title').empty().len(2,20,"bad name.").trim().toLow();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        yield GoodsType.create({
            title:this.query.title,
            type:this.query.type,
            GoodsTypeId:this.query.fid
        });


        this.body = this.query.title ;


    });

    router.get('/adminer/edittype',  function *() {


        this.checkQuery('title').empty().len(2,20,"bad name.").trim().toLow();
        if (this.errors) {
            this.body = this.errors;
            return;
        }

        var type= yield GoodsType.findById(this.query.id);

        type.title=this.query.title;

        yield type.save();


        this.body = this.query.title ;


    });

    router.get('/adminer/deltype',  function *() {

        var type= yield GoodsType.findById(this.query.id);

        if(type.type==2){
            var count=type.Goods.length;
            if(count>0){
                type.destroy();
            }

        }
        else{
            var count=type.GoodsType.length;
            if(count>0){
                type.destroy();
            }
        }



        yield type.save();


        this.body = this.query.title ;


    });


    router.get('/adminer/save-goodstype',  saveView);
    router.get('/adminer/save-goodstype/:id', saveView);

    function * saveView() {

        this.body = yield render('goodstype/newgoods.html', {

        });
    }

    router.post('/adminer/save-goodstype', function *() {
        var ret = true;
        this.checkBody('title').notEmpty();
        this.checkBody('type').toInt().gt(0).lt(3);
        if (this.errors)  {
            this.body = this.errors;
            return;
        }
        var req = this.request;
        console.log(req.body);
        if (req.body.type == 2 && !req.body.id) {
            this.checkBody('topid').notEmpty();
        }
        if (req.body.id) {
            var goodsType = yield GoodsType.findById(req.body.id);
            if (util.isNullOrUndefined(goodsType)){
                ret = false;
            } else {
                goodsType.title = req.body.title;
                yield goodsType.save();
            }
        } else {
            if (req.body.type == 2) {
                var goodsType = yield GoodsType.findById(req.body.topid);
                if (util.isNullOrUndefined(goodsType)){
                    ret = false;
                } else {
                    yield goodsType.addGoodsType({
                        title: req.body.title,
                        type: 2
                    });
                }
            } else {
                yield GoodsType.create({
                    title: req.body.title,
                    type: 1
                });
            }
        }
        if (ret === false) {
            req.body.id ? this.redirect(`/adminer/save-goodstype/${req.body.id}`) : this.redirect('/adminer/save-goodstype');
            return;
        }
        this.redirect('/adminer/goodstype-list');
    });

    router.get('/all-goodstype', '/all-goodstype/:id', function *() {
        var data;
        if (this.params.id) {
            data = yield GoodsType.findById(this.params.id);
            if (util.isNullOrUndefined(data)) {
                this.throw(401);
                return;
            }
            data = yield data.getGoodsTypes();
        } else {
            data = yield GoodsType.findAll({
                where: {
                    type: 1
                }
            });
        }
        this.body = JSON.stringify(data);
        return;
    })

};