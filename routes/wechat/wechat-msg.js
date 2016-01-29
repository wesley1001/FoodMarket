/**
 * Created by me on 15-12-1.
 */
var Promise = require('bluebird');
var wechatConfig = require('./../../instances/config.js').wechat;
var log = require('./../../instances/log.js');
var auth = require('./../../helpers/auth.js');
var util = require('util');

var db = require('./../../models/index.js');
var CoWechat = require('co-wechat');


module.exports = (router) => {

    router.use(CoWechat({
        appId: wechatConfig.appId,
        token: wechatConfig.token,
        encodingAESKey: wechatConfig.encodingAESKey
    }).middleware(function *() {
        var message = this.weixin;

        console.log('what message', message);

        var develping = [
            'RedPacket',
            'Coupon',
            'Advice',
            'ReceiveMsg',
            'ServiceRule',
            'MerchantMsg',
            'CustomerService'
        ];

        if (develping.indexOf(message)) {
            this.body = '正在开发中';
        } else {
            this.body = '你好';
        }

    }));

};
