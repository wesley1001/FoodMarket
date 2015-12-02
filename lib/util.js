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



module.exports = {
    Reg,
    md5
};
