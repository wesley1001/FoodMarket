/**
 * Created by lxc on 15-12-18.
 */
var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {

    var Area = db.models.Area;

    router.get('/adminer/Area', function *() {
        var types = yield Area.all();
        debug(types);
        this.body = yield render('admin/Area', {
            types
        });
    });


    router.get('/adminer/addArea', function *() {

        if (this.query.type != 1) {
            this.checkQuery('fid').toInt(0);
        }
        this.checkQuery('title').empty().len(2, 20, "bad name.").trim().toLow();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        yield Area.create({
            title: this.query.title,
            type: this.query.type,
            AreaId: this.query.fid
        });

        this.body = this.query.title;
    });

    router.get('/adminer/editArea', function *() {

        this.checkQuery('title').empty().len(2, 20, "bad name.").trim().toLow();
        if (this.errors) {
            this.body = this.errors;
            return;
        }

        var type = yield Area.findById(this.query.id);
        type.title = this.query.title;
        yield type.save();
        this.body = this.query.title;
    });

    router.get('/adminer/delArea', function *() {

        var type = yield Area.findById(this.query.id);

        if (type.type == 2) {
            var count = type.Goods.length;
            if (count > 0) {
                type.status = -1;
            }

        }
        else {
            var count = type.Area.length;
            if (count > 0) {
                type.status = -1;
            }
        }
        yield type.save();
        this.body = this.query.title;

    });
};