/**
 * Created by lxc on 15-12-10.
 */
var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {


    router.get('/adminer/fare',  function *() {
        //var id=this.query.id;
        //var seller=yield Seller.findById(1);
        var fare=10;
        var cotent=20;
        this.body = yield render('admin/Fare', {
            fare
        });
    });






};