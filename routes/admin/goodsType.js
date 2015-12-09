var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var GoodsType = db.models.GoodsType;

    router.get('/adminer/goodstype', function *() {

        this.body = yield render('admin/goodstype.html', {

        });
    });

    router.get('/adminer/save-goodstype', '/adminer/save-goodstype/:id', function *() {

        this.body = yield render('admin/goodstype/create.html', {

        });
    });

    router.post('/adminer/save-goodstype', function *() {
        var ret = true;
        this.checkBody('title').notEmpty();
        this.checkBody('type').toInt().gt(0).lt(3);
        var req = this.req;
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
                yield goodsType.create({
                    title: req.body.title,
                    type: 1
                });
            }
        }
        if (ret = false) {
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