/**
 * Created by bian on 15-12-3.
 */

var sendbtn = $('#validate');
var code = '';
var result = false;

sendbtn.click(function(){
    var phone = $('#tel').val();
    var url = '/verifyCode/' + phone;
    if(phone && phone.match(/^1[3-8]+\d{9}$/)) {
        $.ajax({
            url:url,
            type:'GET',
            success:function(data){
                if(data === -1){
                    alert('fail');
                }else{
                    code = data;
                    startClock();
                }
            }
        });
    }else{
        alert('input error');
    }
});

function startClock(){
    var count = 60;
    var text = '后，再次发送';
    sendbtn.attr('disabled','disabled');
    $('#tel').attr('disabled','disabled');
    var my_interval = setInterval(function () {
        if (count == 0) {
            stopClock(my_interval);
        } else {
            count --;
            sendbtn.html(count+text);
        }
    }, 1000);
}

function stopClock(my_interval){
    clearInterval(my_interval);
    sendbtn.html('发送验证码');
    sendbtn.removeAttr('disabled');
    $('#tel').removeAttr('disabled');
}

var validatecode = $('#validatecode');
validatecode.click(function(){
    var c = $('#code');
    if(c.val()){
        if(code){
            var url = '/verifyCode/' + $('#tel').val() + '/' + c.val();
            $.ajax({
                url:url,
                type:'GET',
                success:function(data){
                    if(data){
                        c.attr('disabled','disabled');
                        validatecode.html('ok');
                        result = true;
                        validatecode.attr('disabled','disabled');
                    }else{
                        alert('code error');
                    }
                }
            });
        }else{
            alert('please get code first');
        }
    }else{
        alert('input your code');
    }
});

$('#register-submit-btn').click(function(){
    if(result){
        if(sendbtn.attr('disabled'))
            sendbtn.removeAttr('disabled');
        if($('#tel').attr('disabled'))
            $('#tel').removeAttr('disabled');
        if(validatecode.attr('disabled'))
            validatecode.removeAttr('disabled');
        if($('#code').attr('disabled'))
            $('#code').removeAttr('disabled');
        $('#register').submit();
    }else{
        alert('请验证手机号码');
    }
});