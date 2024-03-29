/**
 * Created by me on 15-12-1.
 */
var wechatRobot = require('wechat');
var OAuth = require('wechat-oauth');
var Promise = require('bluebird');

var wechatConfig = require('./../../instances/config.js').wechat;
var log = require('./../../instances/log.js');
var auth = require('./../../helpers/auth.js');
var util = require('util');
var CoWechat = require('co-wechat');

var db = require('./../../models/index.js');

var WechatAuthClient = function () {
    return new OAuth(wechatConfig.appId, wechatConfig.secret);
};

module.exports = (router) => {


    var User = db.models.User;

    var wechatCookieAccessToken = 'FoodMarketWechatAccessToken',
        wechatCookieRefreshToken = 'FoodMarketWechatRefreshToken';

    var refresh = function *(ctx, client) {
        try{
            var result = yield client.refreshAccessToken(refreshToken);
            ctx.cookies.set(wechatCookieRefreshToken, result.refresh_token);
            ctx.cookies.set(wechatCookieAccessToken, result.access_token);
            return result;
        } catch(ex) {
            console.log(ex);
            log.error(ex);
            return false;
        }
    };

    //router.get('/wechat-gate', function *() {
    //    //console.log('wechat gate');
    //    //if (wechatRobot.checkSignature(this.request.query, wechatConfig.token)) {
    //    //    console.log(this.request.query.echostr);
    //    //    this.body = this.request.query.echostr;
    //    //}else {
    //    //    this.body = "fail";
    //    //}
    //
    //
    //});

    router.all('/wechat-gate', CoWechat({
        appid: wechatConfig.appId,
        token: wechatConfig.token,
        //encodingAESKey: wechatConfig.encodingAESKey
    }).middleware(function *() {
        var message = this.weixin;

        console.log('what message', message);

        var develping = [
            'RedPacket',
            'Coupon',
            'Advice',
            'ReceiveMsg',
            'ServiceRule',
            'MerchantMsg'
        ];

        if (develping.indexOf(message.EventKey) != -1) {
            this.body = '正在开发中';
        } else if (message.EventKey == "CustomerService") {
            this.body = '客服电话：400-115-8889';
        } else {
            this.body = '你好';
        }

    }));

    router.get('/wechat/redirect', function *() {
        var client = WechatAuthClient();
        var url = client.getAuthorizeURL(`${wechatConfig.domain}/wechat/auth`, 'foodmarket', 'snsapi_userinfo');
        this.redirect(url);
    });

    router.get('/wechat/auth', function *(next) {
        var client = WechatAuthClient();
        var ctx = this;
        var p = new Promise(function (resolve) {
            client.getAccessToken(ctx.request.query.code, function (err, result) {
                if (err) {
                    console.log(err);
                    ctx.redirect('/wechat/redirect');
                    resolve(null);
                    return;
                }
                var accessToken = result.data.access_token;
                var openid = result.data.openid;
                ctx.cookies.set(wechatCookieRefreshToken, result.data.refresh_token);
                ctx.cookies.set(wechatCookieAccessToken, result.data.access_token);
                client.getUser(openid, function (err, userInfo) {
                    resolve(userInfo);
                });
            });
        });

        var user = yield p;
        if (user == null) {
            ctx.redirect('/wechat/redirect');
            return;
        }
        var dbUser = yield User.findOne({
            where: {
                openid: user.openid
            }
        });

        if (util.isNullOrUndefined(dbUser)) {
            dbUser = yield User.create({
                name: '用户',
                nickname: user.nickname,
                headimage: user.headimgurl,
                sex: user.sex,
                openid: user.openid
            });
        } else {
            dbUser.name = User.nickname;
            dbUser.headimage = User.headimgurl;
            dbUser.sex = User.sex;
            dbUser.openid = User.openid;
        }
        auth.login(this, dbUser, 1);
        if (dbUser.status === 1) {
            this.redirect('/user/index');
        } else if (dbUser.status === -2){
            this.redirect('/user-register');
        } else {
            this.redirect('/user-wait');
        }
    });

    //router.get('/wechat/login', function *() {
    //    var client = WechatAuthClient();
    //    var user = yield auth.user(this);
    //    var accessToken;
    //    var ctx = this;
    //    var openid;
    //    if (util.isNullOrUndefined(user)) {
    //        var refreshToken = this.cookies.get(wechatCookieRefreshToken);
    //        if (util.isNullOrUndefined(refreshToken)) {
    //            this.redirect('/wechat/redirect');
    //            return;
    //        }
    //        var result = yield refresh(this, client);
    //        accessToken = result.access_token;
    //        openid = result.opnid;
    //        user = yield User.findOne({
    //            where: {
    //                openid
    //            }
    //        });
    //        if (util.isNullOrUndefined(user)) {
    //            this.redirect('/wechat/redirect');
    //            return;
    //        }
    //    }
    //    if (user.status === 1) {
    //        this.redirect('/user/index');
    //    } else if (user.status === -2){
    //        this.redirect('/user-register');
    //    } else {
    //        this.redirect('/user-wait');
    //    }
    //});

};
