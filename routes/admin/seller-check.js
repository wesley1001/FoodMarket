var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Seller = db.models.Seller;

    router.get('/adminer/checkList',  function *() {
        this.body = yield render('admin/checkList.html');
    });


    /**
     * 处理审核结果
     */
    router.post('/adminer/checkList', function *() {
        var request = this.request,
            data = request.body;
            console.log(data);
        try{
            if (data.event === 'confirm') {
                var confirm_seller = yield Seller.findById(data.id);
                if (!util.isNullOrUndefined(confirm_seller)) {
                    confirm_seller.status = 0;
                    yield confirm_seller.save();
                }
            }

            if (data.event === 'delete') {
                var delete_seller = yield Seller.findById(data.id);

                if (!util.isNullOrUndefined(delete_seller)) {
                    yield delete_seller.destroy();
                }
            }

        }catch(error){
            throw error;
        }

    });


    /**
     * 获取未审核数据
     */
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


    /**
     * 获取已审核数据
     */
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