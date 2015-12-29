var crypto = require('crypto');

var Reg = {};

Reg.ip = (function() {
    var ipReg =  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    return (str) => {
        return ipReg.test(str);
    };
}());

var md5 = (str, encoding) => {
    encoding = encoding || 'base64';
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest(encoding);
};

var randomNum = (length) => {
    return Math.random().toString(10).substring(2, 2 + length);
};

var intToFixString = (str, length) => {
    str = str.toString();
    var len = length - str.length;
    for(i = 0; i < len; i ++) {
        str = '0' + str;
    }
    return str;
};

module.exports = {
    Reg,
    md5,
    randomNum,
    intToFixString
};
