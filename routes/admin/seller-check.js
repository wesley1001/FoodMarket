var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Seller = db.models.Seller;

    router.get('/adminer/checkList',  function *() {

        var non_check_sellers = yield Seller.findAll({
            where: {
                status: -1
            }
        });
        var check_sellers = yield Seller.findAll({
            where: {
                status: 0
            }

        });
        // console.log(non_check_sellers);

        // 取出non_check_seller中的dataValues对象，显示于网页
        var non_data_values = [],
            non_check_seller;
        for (non_check_seller in non_check_sellers) {
            if (non_check_sellers.hasOwnProperty(non_check_seller)) {
                non_data_values.push(non_check_sellers[non_check_seller].dataValues);
            }
        }

        // 取出check_seller中的dataValues对象，显示于网页
        var data_values = [],
            check_seller;
        for (check_seller in check_sellers) {
            if (check_sellers.hasOwnProperty(check_seller)) {
                data_values.push(check_sellers[check_seller].dataValues);
            }
        }

        console.log('data_values', data_values);
        this.body = yield render('admin/checkList.html', {
            non_data_values,
            data_values
        });
    });

};