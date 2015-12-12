/**
 * Created by bian on 15-12-6.
 */

var render = require('../../instances/render');
var db = require('../../models/index');
var deliverAddress = db.models.DeliverAddress;

module.exports = (router) => {
    router.get('/user/address',function *(){
        //todo: get current user ID
        var data = yield deliverAddress.findAll({
            where:{
                UserID:1
            }
        });
        console.log(data);
        this.body = yield render('user/address.html',{datas:data});
    });

    router.get('/user/addaddress',function *(){
       this.body = yield render('user/addaddress.html');
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
        //var id = require('../../helpers/auth').id;

        data.UserId = 1;
        console.log(data);
        yield deliverAddress.create(data);
        this.body = '1';
    });
};