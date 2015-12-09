/**
 * Created by li_rz on 2015/12/4.
 */
var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {
    var Adminer = db.models.Adminer;

    router.get('/adminer/checkAdminForm',  function *() {
        this.body = yield render('admin/checkAdminForm.html');
    });

    router.get('/adminer/admin.json', function *() {
        var adminer_list = yield Adminer.findAll();
        this.body = JSON.stringify(adminer_list.map(function (item) {
            return item.dataValues;
        }));
    });
};