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
var WechatAPI = require('co-wechat-api');


var wxpay = WXPay({
    appid: wechatConfig.appId,
    mch_id: wechatConfig.mchId,
    partner_key: wechatConfig.partnerKey, //微信商户平台API密钥
    //pfx: fs.readFileSync(wechatConfig.pfx), //微信商户平台证书
});
var wechatApi = new WechatAPI(wechatConfig.appId, wechatConfig.secret);


module.exports = (router) => {


    var User = db.models.User;
    var Order = db.models.Order;

    var payCookieName = 'xiaodizhupaycookies';


    router.get('/user/wechat-pay/:id', function *() {

        var ctx = this;
        var id = this.params.id;

        if (util.isNullOrUndefined(id)) {
            this.body = '错误操作';
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
        var outerTradeId = utilx.intToFixString(order.id, 32);

        var payInfo;
        var createOrder = false;
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


            var queryResult = yield queryPromise;


            if (queryResult.trade_state == 'NOTPAY') {
                console.log('from prepay');
                payInfo = {
                    appId: wechatConfig.appId,
                    timeStamp: Math.floor(Date.now()/1000)+"",
                    nonceStr: utilx.randomNum(32),
                    package: "prepay_id="+ order.prepayId,
                    signType: "MD5"
                };

                payInfo.paySign = wxpay.sign(payInfo);
            } else {
                createOrder = true;
            }
        } else {
            createOrder = true;
        }
        if (createOrder){

            var payPromise = new Promise(function (resolve, reject) {

                wxpay.getBrandWCPayRequestParams({
                    openid: user.openid,
                    body: '小地主订单支付' + order.id,
                    detail: '公众号支付测试',
                    out_trade_no: outerTradeId,
                    total_fee: 1, //todo: for test 1分
                    spbill_create_ip: '182.92.203.172',
                    attach: order.id,
                    notify_url: `${wechatConfig.domain}/wechat/paid`
                }, function(err, result){
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    resolve(result);
                });
            });

            console.log( `${wechatConfig.domain}/wechat/paid`);

            payInfo = yield payPromise;

            order.prepayId  = payInfo.package.split('=')[1];

            yield order.save();
        }

        payInfo = JSON.stringify(payInfo);
        this.body = yield render('phone/pay', {
            title: '微信支付',
            payInfo
        });
    });

    //router.get('/user/prepay/:id', function *() {
    //
    //    this.checkParams('id').notEmpty().isInt().toInt();
    //    if (this.errors) {
    //        this.body = this.errors;
    //        return;
    //    }
    //    var nextTwoHour = new Date();
    //    nextTwoHour.setHours(nextTwoHour.getHours() + 2);
    //    this.cookies.set(payCookieName, this.params.id, {
    //        expires: nextTwoHour
    //    });
    //
    //    this.redirect('/user/pay/');
    //
    //});

    router.all('/wechat/paid', function *() {

        var ctx = this;
        var orderId;
        var p = new Promise(function (resolve) {
            var parseFn = wxpay.useWXCallback(function(msg, req, res, next){
                // 处理商户业务逻辑
                orderId = msg.attach;
                console.log('paid info', msg);
                resolve();
            });
            parseFn(ctx.req, ctx.res, {});
        });

        yield p;

        var order = yield Order.findById(orderId);
        order.status = 1;
        order.payTime = new Date();
        yield order.save();

        this.res.success();
    });

};
