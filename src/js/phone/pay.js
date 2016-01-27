require('./base.js');
require('../../css/phone/pay.scss');

var $ = jQuery;

try {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

        var payInfo = JSON.parse($('#pay-info').html());

        console.log(payInfo);
        alert('start to pay');

        alert(JSON.stringify(payInfo));

        var paied = false;
        //公众号支付
        $('#pay').click(function () {
            if (paied) {
                return;
            }
            paied = true;
            WeixinJSBridge.invoke('getBrandWCPayRequest', payInfo, function(res) {
                console.log(res);
                alert(JSON.stringify(res));
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    alert('支付成功，正在条状');
                    window.location = '/user/order-list';
                }
                paied = false;
            });
        }).trigger('click');
    }, false);
} catch (ex) {
    // todo: 删除alert
    alert(JSON.stringify(ex));
}