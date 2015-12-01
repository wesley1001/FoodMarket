/**
 * Created by me on 15-12-1.
 */
var wechatClient = require('./../instances/wechat.js');
var wechatRobot = require('wechat');
var wechatConfig = require('./../instances/config.js').wechat;

module.exports = (router) => {

    router.get('/check', function *() {
        if (wechatRobot.checkSignature(this.req.query, wechatConfig.token)) {
            this.body = this.req.query.echoStr;
        }else {
            this.body = "fail";
        }
    });

    router.get('/wechat/auth', function *(next) {

    });

};