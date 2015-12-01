/**
 * Created by bian on 11/30/15.
 */

var result = [];
function limit(rev,tel,code,area,addr){
    var reg=/^[\u4E00-\u9FA5]+$/g;
    result['rev'] = !!reg.test(rev);

    reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/g;
    result['tel'] = !!reg.test(tel);

    reg = /^[0-9]{6}$/g;
    result['code'] = !!reg.test(code);

    result['area'] = (area.length !== 0);

    result['addr'] = (addr.length !== 0);
}

function hasClass( elements,cName ){
    return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") );
}

function addClass( elements,cName ){
    if( !hasClass( elements,cName ) ){
        elements.className += " " + cName;
    }
}
function removeClass( elements,cName ){
    if( hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " );
    }
}

function validate() {
    var receiver = document.querySelector('#receiver').value;
    var tel = document.querySelector('#tel').value;
    var code = document.querySelector('#code').value;
    var area = document.querySelector('#area').value;
    var addr = document.querySelector('#addr').value;
    limit(receiver, tel, code, area, addr);
    console.log(result);
    var count = 0;
    if(!result['rev']) {
        removeClass(document.querySelector('.a'),'hide');
        addClass(document.querySelector('.a'),'show');
        count += 1;
    }else{
        addClass(document.querySelector('.a'),'hide');
    }

    if(!result['tel']){
        removeClass(document.querySelector('.b'),'hide');
        addClass(document.querySelector('.b'),'show');
        count += 1;
    }else{
        addClass(document.querySelector('.b'),'hide');
    }

    if(!result['code']){
        removeClass(document.querySelector('.c'),'hide');
        addClass(document.querySelector('.c'),'show');
        count += 1;
    }else{
        addClass(document.querySelector('.c'),'hide');
    }

    if(!result['area']){
        removeClass(document.querySelector('.d'),'hide');
        addClass(document.querySelector('.d'),'show');
        count += 1;
    }else{
        addClass(document.querySelector('.d'),'hide');
    }

    if(!result['addr']){
        removeClass(document.querySelector('.e'),'hide');
        addClass(document.querySelector('.e'),'show');
        count += 1;
    }else{
        addClass(document.querySelector('.e'),'hide');
    }

    if(count > 0) {
        removeClass(document.querySelector('#danger'),'hide');
        return true;
    }else{
        addClass(document.querySelector('#danger'),'hide');
        return false;
    }
}


window.onload = function(){
  document.querySelector('#danger').setAttribute('class','hide');
};

var yes = document.querySelector('#yes');
yes.addEventListener('click',function(){
    var v = validate();
});