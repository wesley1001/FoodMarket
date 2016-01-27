require('./base.js');
require('../../css/phone/pay.scss');

var $ = jQuery;

try {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

        var payInfo = JSON.parse($('#pay-info').html());

        console.log(payInfo);
        alert('start to pay');

        alert(JSON.stringify(payInfo));

        //公众号支付
        WeixinJSBridge.invoke('getBrandWCPayRequest', payInfo, function(res) {
            console.log(res);
            alert(JSON.stringify(res));
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                alert('支付完成');
            }
        });
    }, false);
} catch (ex) {
    // todo: 删除alert
    alert(JSON.stringify(ex));
}