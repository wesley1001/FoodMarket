/**
 * Created by me on 15-11-30.
 */
var WechatAuth = require('wechat-oauth');

var wechatConfig = require('./config.js').wechat;

var client = new WechatAuth(wechatConfig.appId, wechatConfig.secret);