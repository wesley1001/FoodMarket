var WechatApi = require('co-wechat-api');
var co = require('co');

var wechatConfig = require('../instances/config.js').wechat;

var wechatApi = new WechatApi(wechatConfig.appId, wechatConfig.secret);

co(function *(){
    var result = yield* wechatApi.createMenu({
        button: [
            {
                name: '优惠',
                sub_button: [
                    {
                        type: 'click',
                        name: '红包',
                        key: 'RedPacket'
                    },
                    {
                        type: 'click',
                        name: '优惠券',
                        key: 'Coupon'
                    }
                ]
            },
            {
                name: '小地主商城',
                type: 'view',
                url: 'http://www.tc2004.com/user/index'
            },
            {
                name: '售后',
                sub_button: [
                    {
                        type: 'click',
                        name: '我希望有',
                        key: 'Advice'
                    },
                    {
                        type: 'click',
                        name: '收货信息',
                        key: 'ReceiveMsg'
                    },
                    {
                        type: 'click',
                        name: '售后规则',
                        key: 'ServiceRule'
                    },
                    {
                        type: 'click',
                        name: '商户信息',
                        key: 'MerchantMsg'
                    },
                    {
                        type: 'click',
                        name: '在线客服',
                        key: 'CustomerService'
                    }
                ]
            }
        ]
    });
    console.log(result);
}).catch((err) => {
    console.log(err);
});