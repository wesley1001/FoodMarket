/**
 * Created by bian on 15-12-6.
 */
//css
require('../../css/user/user.address.js');

var $ = require('expose?jQuery!jquery');
jQuery = $;

$('.del').each(function(){
   $(this).click(function(){
       console.log('hello');
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
               console.log(data + "success");
           }
       })
   });
});

$('#add').click(function(){
    window.location.href = '/user/addaddress';
});