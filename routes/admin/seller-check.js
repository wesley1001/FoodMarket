var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Seller = db.models.Seller;

    router.get('/adminer/checkList',  function *() {

        var sellers = yield Seller.findAll({
            where: {
                status: -1
            }
        });
        // console.log(sellers);

        // 取出seller中的dataValues对象，显示于网页
        var data_values = [],
            seller;
        for (seller in sellers) {
            if (sellers.hasOwnProperty(seller)) {
                data_values.push(sellers[seller].dataValues);
            }
        }

        console.log('data_values', data_values);
        this.body = yield render('admin/checkList.html', {
            data_values
        });
    });

};