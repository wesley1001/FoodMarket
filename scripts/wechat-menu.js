var WechatApi = require('co-wechat-api');
var co = require('co');

var wechatConfig = require('../instances/config.js').wechat;

var wechatApi = new WechatApi(wechatConfig.appId, wechatConfig.secret);

co(function *(){
    var result = yield* wechatApi.removeMenu();
    console.log(result);
    result = yield* wechatApi.createMenu({
        button: [
            {
                name: '优惠',
                sub_button: [
                    {
                        type: 'view',
                        name: '红包',
                        url: 'http://www.tc2004.com/user/index'
                    },
                    {
                        type: 'view',
                        name: '优惠券',
                        url: 'http://www.tc2004.com/user/index'
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
                        type: 'view',
                        name: '我希望有',
                        url: 'http://www.tc2004.com/user/index'
                    },
                    {
                        type: 'view',
                        name: '收货信息',
                        url: 'http://www.tc2004.com/user/index'
                    },
                    {
                        type: 'view',
                        name: '售后规则',
                        url: 'http://www.tc2004.com/user/index'
                    },
                    {
                        type: 'view',
                        name: '商户信息',
                        url: 'http://www.tc2004.com/user/index'
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
