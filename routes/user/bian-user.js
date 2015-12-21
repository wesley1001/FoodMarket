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
        var iser = (yield auth.user(this));
        console.log(user);
        //todo: get current user ID
        var data = yield deliverAddress.findAll({
            where:{
                UserId: user.id
            }
        });
        this.body = yield render('user/address.html',{datas:data});
    });

    router.get('/user/addaddress',function *(){
        var area = yield Area.findAll({
            where:{
                type:2
            }
        });
        this.body = yield render('user/addaddress.html',{
            area
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

        //todo: get current user ID
        var id = (yield auth.user(this)).id;

        data.UserId = id;
        data.isDefault = false;
        yield deliverAddress.create(data);
        this.body = '1';
    });
};