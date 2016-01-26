require('./base.js');

var $ = jQuery;

//$(function () {
//
//    try {
//        var payInfo = JSON.parse($('#pay-info').html());
//
//        console.log(payInfo);
//
//        $('#pay').click(function () {
//            var a = WeixinJSBridge.invoke(
//                "getBrandWCPayRequest", payInfo , function(res){
//                    console.log(res);
//                    alert(JSON.stringify(arguments));
//                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
//                        console.log('paid');
//                    }
//                });
//            console.log(a);
//        });
//    } catch(ex) {
//        alert(JSON.stringify(ex));
//    }
//
//
//});