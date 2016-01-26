/**
 * Created by me on 15-12-1.
 */
var wechatRobot = require('wechat');
var OAuth = require('wechat-oauth');
var Promise = require('bluebird');
var fs = require('fs');

var wechatConfig = require('./../../instances/config.js').wechat;
var log = require('./../../instances/log.js');
var debug = require('./../../instances/debug.js');
var auth = require('./../../helpers/auth.js');
var util = require('util');
var utilx = require('./../../lib/util.js');
var render = require('../../instances/render');

var db = require('./../../models/index.js');

var WXPay = require('weixin-pay');

var wxpay = WXPay({
    appid: wechatConfig.appId,
    mch_id: wechatConfig.mchId,
    partner_key: wechatConfig.partnerKey, //微信商户平台API密钥
    //pfx: fs.readFileSync(wechatConfig.pfx), //微信商户平台证书
});


module.exports = (router) => {


    var User = db.models.User;
    var Order = db.models.Order;

    var payCookieName = 'xiaodizhupaycookies';

    router.get('/user/pay/', function *() {

        var ctx = this;
        var id = this.cookies.get(payCookieName);

        if (util.isNullOrUndefined(id)) {
            this.body = 'invalid id';
            return;
        }

        var order = yield Order.findOne({
            where: {
                id: id,
                // unpaid
                status: 0
            }
        });

        if (util.isNullOrUndefined(order)) {
            this.body = '错误操作';
            return;
        }
        var user = yield auth.user(this);
        var outerTradeId = "xiaodizhu" + utilx.intToFixString(order.id, 23);

        var payInfo;
        if (!util.isNullOrUndefined(order.prepayId)) {
            // 已经支付过，检测prepayid是否有效
            console.log('has prepayId');
            var queryPromise = new Promise(function (resolve, reject) {
                wxpay.queryOrder({ out_trade_no: outerTradeId }, function(err, order){
                    if (err) {
                        debug(err);
                        reject(err);
                    }
                    debug(order);
                    resolve(order);
                });
            });


            payInfo = yield queryPromise;
            console.log('payInfo', payInfo);
        } else {
            console.log('pay');
            var p = new Promise(function (resolve, reject) {

                wxpay.getBrandWCPayRequestParams({
                    openid: user.openid,
                    body: '小地主订单支付' + order.id,
                    detail: '公众号支付测试',
                    out_trade_no: outerTradeId,
                    total_fee: 1, //todo: for test 1分
                    spbill_create_ip: '182.92.203.172',
                    attach: order.id,
                    notify_url: `${wechatConfig.domain}/wechat/paid`,
                }, function(err, result){
                    if (err) {
                        console.log(err);
                        debug(err);
                        reject(err);
                    }
                    resolve(result);
                });

                //wxpay.createUnifiedOrder({
                //    body: '小地主订单支付' + order.id,
                //    out_trade_no: outerTradeId,
                //    total_fee: 1, //todo: for test 1分
                //    //spbill_create_ip: ctx.ip,
                //    notify_url: 'http://139.129.18.214/wechat/paid',
                //    trade_type: 'JSAPI',
                //    openid: user.openid,
                //    attach: order.id
                //    //product_id: '1234567890'
                //}, function(err, result){
                //    if (err) {
                //        debug(err);
                //        reject(err);
                //    }
                //    resolve(result);
                //});
            });

            payInfo = yield p;

            debug(payInfo);
            console.log('payInfo', payInfo);
        }

        payInfo = JSON.stringify(payInfo);
        this.body = yield render('phone/pay', {
            title: '微信支付',
            payInfo
        });
    });

    router.get('/user/prepay/:id', function *() {

        this.checkParams('id').notEmpty().isInt().toInt();
        if (this.errors) {
            this.body = this.errors;
            return;
        }
        var nextTwoHour = new Date();
        nextTwoHour.setHours(nextTwoHour.getHours() + 2);
        this.cookies.set(payCookieName, this.params.id, {
            expires: nextTwoHour
        });

        this.redirect('/user/pay/');

    });

    router.get('/wechat/paid', function *() {
        debug('paid');
        console.log('paid');
        console.log(JSON.stringify(this.query));
        console.log(JSON.stringify(this.request.body));
    });



};
