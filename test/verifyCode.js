
var verifyCode = require('../helpers/verifyCode');

describe('verifyCode', function () {

    it('send and test', function *() {
        var phone = "18840823910";
        var code = verifyCode.send(phone);
        var verified = yield verifyCode.verify(phone, code);
        verified.should.be.true();
    })

});