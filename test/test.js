var verifyCode = require('../helpers/verifyCode');
var co = require('co');
//var code = verifyCode.send("18840823910");
//console.log(code);
co(function *() {
    var ret = yield verifyCode.verify("18840823910", "500221");
    console.log(ret);
});