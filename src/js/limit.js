/**
 * Created by bian on 11/30/15.
 */

var result = [];
function limit(rev,tel,code,area,addr){
    var reg=/^[\u4E00-\u9FA5]+$/g;
    result['rev'] = reg.test(rev);

    reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/g;
    result['tel'] = reg.test(tel);

    reg = /^[0-9]{6}$/g;
    result['code'] = reg.test(code);

    result['area'] = (area !== '');

    result['addr'] = (addr !== '');
}

function validate() {
    var receiver = document.querySelector('#receiver').value;
    var tel = document.querySelector('#tel').value;
    var code = document.querySelector('#code').value;
    var area = document.querySelector('#code').value;
    var addr = document.querySelector('#addr').value;
    limit(receiver, tel, code, area, addr);
    console.log(result);
    return result;
}

var yes = document.querySelector('#yes');
yes.addEventListener('click',function(){
    validate();
});
console.log(result);