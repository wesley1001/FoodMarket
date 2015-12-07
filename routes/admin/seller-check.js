var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Seller = db.models.Seller;

    router.get('/adminer/checkList',  function *() {
        this.body = yield render('admin/checkList.html');
    });

    //router.post('/adminer/checkList', function *() {
    //    console.log(this);
    //
    //});

    router.get('/adminer/uncheck.json',  function *() {

        var non_check_sellers = yield Seller.findAll({
            where: {
                status: -1
            }
        });
        this.body = JSON.stringify(non_check_sellers.map(function (item) {
            return item.dataValues;
        }));
    });

    router.get('/adminer/check.json', function *() {
        var check_sellers = yield Seller.findAll({
            where: {
                status: 0
            }
        });

        this.body = JSON.stringify(check_sellers.map(function (item) {
            return item.dataValues;
        }));
    });
};