/**
 * Created by bian on 12/3/15.
 */

var verifyCode = require('../../helpers/verifyCode');
var debug = require('../../instances/debug');
var render = require('../../instances/render');
var db = require('../../models/index');
var Seller = db.models.Seller;

module.exports = (router) => {
    router.get('/seller/login', function *() {
        debug('start render seller login');
        this.body = yield render('seller/login.html');
    });

    // todo: redirect
    router.post('/seller/login',function *(){
        var ctx = this;
        var body = this.request.body;
        console.log(body);
        this.checkBody('phone').notEmpty();
        this.checkBody('phone').match(/^1[3-8]+\d{9}$/);
        this.checkBody('password').notEmpty();
        if(this.errors){
            console.log(this.errors);
            return;
        }
        try{
            var c = yield Seller.count({
                where:{
                    phone:body.phone,
                    password:body.password
                }
            });
            if(c){
                ctx.body = '1';
            }else{
                ctx.body = '0';
            }
        }catch (err){
            ctx.body = '0';
        }
    });

    router.get('/verifyCode/:phone', function *() {
        this.checkParams('phone').notEmpty();
        this.checkParams('phone').match(/^1[3-8]+\d{9}$/);
        if(this.errors){
            debug(this.errors);
            this.body = -1;
            return;
        }
        var code = yield verifyCode.send(this.params.phone);
        debug(code);
        this.body = code;
    });

    router.get('/verifyCode/:phone/:code', function *() {
        this.checkParams('phone').notEmpty();
        this.checkParams('phone').match(/^1[3-8]+\d{9}$/);
        this.checkParams('code').notEmpty();
        this.checkParams('code').optional().len(6);
        if(this.errors){
            this.body = 0;
            return;
        }
        var result = yield verifyCode.verify(this.params.phone, this.params.code);
        this.body = result;
    });

    router.post('/seller/register',function *(){
        var body = this.request.body;
        console.log(body);
        var ctx = this;
        this.checkBody('name').notEmpty();
        this.checkBody('password').notEmpty();
        this.checkBody('phone').notEmpty();
        this.checkBody('type').notEmpty();
        this.checkBody('address').notEmpty();
        this.checkBody('shopName').notEmpty();
        if(this.errors){
            console.log(this.errors);
            return;
        }

        data = {
            name:body.name,
            password:body.password,
            phone:body.phone,
            address:body.address,
            shopName:body.shopName,
            type:body.type
        };

        console.log(data);

        try{
            yield Seller.create(data);
            this.body = '1';
        }catch (err){
            console.log(err);
            this.body = '0';
        }
    });
};