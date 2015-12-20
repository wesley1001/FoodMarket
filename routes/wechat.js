/**
 * Created by me on 15-12-1.
 */
var wechatClient = require('./../instances/wechat.js');
var wechatRobot = require('wechat');
var wechatConfig = require('./../instances/config.js').wechat;
var log = require('./../instances/log.js');

var client = new OAuth(wechatConfig.appId, wechatConfig.secret);
module.exports = (router) => {

    router.get('/check', function *() {
        if (wechatRobot.checkSignature(this.req.query, wechatConfig.token)) {
            this.body = this.req.query.echoStr;
        }else {
            this.body = "fail";
        }
    });

    router.get('wechat/redirect', function *() {
        var url = client.getAuthorizeURL('http://139.129.18.214/wechat/auth', 'state', 'scope');
        this.redirect(url);
        log.info('wechat/redirect');
    });

    router.get('/wechat/auth', function *(next) {
        var result = yield client.getAccessToken('code', function (err, result) {
        });

        log.info(result);
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        var userInfo = yield client.getUser('openid');
        log.info(userInfo);
    });

};