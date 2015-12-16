/**
 * Created by lxc on 15-12-17.
 */
var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {

    var Seller = db.models.Seller;

    router.get('/adminer/accountlist',  function *() {
        var id=this.query.id;
        var seller=yield Seller.findById(id);
        debug(seller);
        this.body = yield render('admin/Fare', {
            seller
        });
    });

    router.post('/adminer/accountlist',  function *() {

        var body=this.request.body;
        var seller=yield Seller.findById(body.id);
        debug(this.request.body);
        seller.fare=body.fare;
        seller.content=body.content;
        yield seller.save();
        this.body = yield render('admin/Fare', {
            seller
        });
    });






};