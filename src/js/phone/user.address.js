require('./base.js');
require('../../css/phone/address.scss');

var $  = jQuery;

$('.del').each(function(){
   $(this).click(function(){
       var $this = $(this);
       var id = $this.attr('id');
       var contentID = '#'+id;
       var content = $(contentID);
       content.hide();
       var url = '/user/address/del/' + id;
       $.ajax({
           url:url,
           type:'GET',
           success:function(data){
           }
       })
   });
});

$('#add').click(function(){
    window.location.href = '/user/addaddress';
});