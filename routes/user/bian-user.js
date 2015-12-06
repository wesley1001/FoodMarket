/**
 * Created by bian on 15-12-6.
 */

var render = require('../../instances/render');

module.exports = (router) => {
    router.get('/user/address',function *(){
        this.body = yield render('user/address.html',{});
    });

    router.get('/user/addaddress',function *(){
       this.body = yield render('user/addaddress.html');
    });
};