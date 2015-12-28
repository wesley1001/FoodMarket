/**
 * Created by bian on 15-12-6.
 */

var render = require('../../instances/render');
var db = require('../../models/index');
var deliverAddress = db.models.DeliverAddress;
var Area = db.models.Area;
var auth = require('../../helpers/auth');

module.exports = (router) => {
    router.get('/user/address',function *(){
        var user = (yield auth.user(this));

        var data = yield deliverAddress.findAll({
            where:{
                UserId: user.id
            },
            include: [Area]
        });
        this.body = yield render('phone/address.html',{
            datas:data,
            title: '收货地址'
        });
    });

    router.get('/user/addaddress',function *(){
        var area = yield Area.findAll({
            where:{
                type:2
            }
        });
        this.body = yield render('phone/addaddress.html',{
            area,
            title: '添加收货地址'
        });
    });

    router.get('/user/address/del/:id',function *(){
        var id = this.params.id;
        yield deliverAddress.destroy({
            where:{
                id:id
            }
        });
        this.body = '1';
    });

    router.post('/user/address/add',function *(){
        var data = this.request.body;
        console.log(data);


        data.UserId = (yield auth.user(this)).id;
        data.isDefault = false;
        yield deliverAddress.create(data);
        this.body = '1';
    });
};