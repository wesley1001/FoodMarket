/**
 * Created by me on 15-12-1.
 */
var wechatRobot = require('wechat');
var OAuth = require('wechat-oauth');
var Promise = require('bluebird');

var wechatClient = require('./../instances/wechat.js');
var wechatConfig = require('./../instances/config.js').wechat;
var log = require('./../instances/log.js');
var auth = require('./../helpers/auth.js');
var util = require('util');
var thunkify = require('thunkify');


var WechatAuthClient = function () {
    return new OAuth(wechatConfig.appId, wechatConfig.secret);
};

module.exports = (router) => {


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

    router.get('/wechat-gate', function *() {
        console.log(this.request.query);
        if (wechatRobot.checkSignature(this.request.query, wechatConfig.token)) {
            console.log(this.request.query.echostr);
            this.body = this.request.query.echostr;
        }else {
            this.body = "fail";
        }
    });

    router.get('/wechat/redirect', function *() {
        var client = WechatAuthClient();
        var url = client.getAuthorizeURL('http://139.129.18.214/wechat/auth', 'foodmarket', 'snsapi_userinfo');
        this.redirect(url);
    });

    router.get('/wechat/auth', function *(next) {
        var client = WechatAuthClient();
        var ctx = this;
        var p = new Promise(function (resolve) {
            client.getAccessToken(ctx.request.query.code, function (err, result) {
                var accessToken = result.data.access_token;
                var openid = result.data.openid;
                client.getUser(openid, function (err, userInfo) {
                    resolve(userInfo);
                });
            });
        });

        this.body = yield p;
        console.log(this.body);

    });

    router.get('/ttt', function *() {
        this.body = this.url + '-----' +  this.host;
    });

    router.get('/wechat/login', function *() {
        var client = WechatAuthClient();
        var user = auth.user(this);
        var accessToken;
        var ctx = this;
        var openid;
        if (util.isNullOrUndefined(user)) {
            var refreshToken = this.cookies.get(wechatCookieRefreshToken);
            if (util.isNullOrUndefined(refreshToken)) {
                this.redirect('/wechat/redirect');
                return;
            }
            var result = yield refresh(this, client);
            accessToken = result.access_token;
            openid = result.opnid;
            user = yield client.getUser(result.openid);
            log.info(JSON.stringify(user));
            console.log(user);
            auth.login(this, user);
        }
        this.redirect('/user/index');
    });

};
