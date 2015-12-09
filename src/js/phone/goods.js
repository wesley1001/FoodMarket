require('imports?$=jquery!amazeui/dist/css/amazeui.css');
require('../../css/phone/goods.scss');

require('Swiper/dist/css/swiper.css');

require('Swiper/dist/js/swiper.js');

$(function () {
    var windowWidth = $(window).width();
    var mySwiper =  new Swiper('.swiper-container', {
        freeMode : true,
        width: windowWidth,
        height: windowWidth * 310 / 130.0,
        pagination: '.swiper-pagination',
    });

    var $counter = $('.goods-counter'),
        $minus = $('.minus', $counter),
        $add = $('.plus', $counter),
        $input = $('input', $counter),
        goodsId = $input.data('id'),
        goodsNum = parseInt($input.val());

    console.log($add);

    var timer;

    function counterChange(num) {
        console.log('what');
        if (num >= 0 ){
            goodsNum = num;
            $input.val(goodsNum);
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                clearInterval(timer);
                $.get('/user/shoppingcart/' + goodsId + '/' + goodsNum);
            },  1000);
        }
    }

    $minus.click(function () {
        counterChange(goodsNum - 1);
    });

    $add.click(function () {
        counterChange(goodsNum + 1);
    });

    $input.blur(function () {
        var num = parseInt($input.val());
        if (num != goodsNum){
           counterChange(num);
       }
    });
});