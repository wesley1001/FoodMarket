/**
 * Created by me on 15-12-10.
 */
require('imports?$=jquery!amazeui/dist/css/amazeui.css');

require('../../css/seller/register.scss');

require('distpicker/dist/distpicker.data.js');
require('imports?$=jquery, ChineseDostricts=distpicker/dist/distpicker.data.js, define=>false, exports=>false!distpicker/dist/distpicker.js');


var $ = jQuery;

$(function () {
    $("#distpicker").distpicker();

    var phoneVerified = false;
    var $phone = $('#phone'),
        $verifyCodeGetter = $('#get-verify-code'),
        $code = $('#code');

    var submit = false;
    $('form').validator({
        onValid: function(validity) {

            $(validity.field).closest('.am-form-group').find('.am-alert').addClass('am-hide');
        },
        onInValid: function(validity) {
            $(validity.field).closest('.am-form-group').find('.am-alert').removeClass('am-hide');
        },
        submit: function(e) {
            if (submit) {
                return;
            }
            var formValidity = this.isFormValid();
            e.preventDefault();
            e.stopPropagation();
            $('[name=districtCode]').val($('[name=country] option:selected').data('code'));
            $.when(formValidity).then(function() {
                $.ajax({
                    url: '/verifyCode',
                    data: {
                        phone: $phone.val(),
                        code: $code.val()
                    },
                    success: function (ret) {
                        if(ret) {
                            submit = true;
                            debugger
                            $('form').submit();
                        }
                    }
                })
            }, function() {

            });
        }
    });

    var timer;
    var click = 60;
    $verifyCodeGetter.click(function () {
        if (timer) {
            return;
        }
        var phone = $phone.val();
        if (!/^\d{11}$/.test(phone)){
            return;
        }
        click = 60;
        $.get('/verifyCode/' + phone);
        timer = setInterval(function () {
            if (!click) {
                clearInterval(timer);
                $verifyCodeGetter.html('获取验证码');
            } else {
                click --;
                $verifyCodeGetter.html('已获取(' + click + ')');
            }
        }, 1000);
    });


});