require('./base.js');

var $ = jQuery;

$(function () {

    try {
        var payInfo = JSON.parse($('#pay-info').html());

        alert(JSON.stringify(payInfo));

        $('#pay').click(function () {
            WeixinJSBridge.invoke(
                "getBrandWCPayRequest", payInfo , function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        console.log('paid');
                    }
                });
        });
    } catch(ex) {
        alert(JSON.stringify(ex));
    }


});