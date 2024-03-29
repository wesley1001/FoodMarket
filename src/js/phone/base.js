require('expose?jQuery!jquery');
require('amazeui/dist/css/amazeui.css');
require('amazeui/dist/js/amazeui.js');

var $ = jQuery;

$(function () {
    $('body').css('opacity', 1);
    $('#loadding-layer').hide();
});

module.exports = {
    bottomBar: function (active) {
        jQuery(function () {
            jQuery('#navbar').find('li').eq(active).addClass('active');
        });
    }
};