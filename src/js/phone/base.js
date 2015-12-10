module.exports = {
    bottomBar: function (active) {
        jQuery('#navbar').find('li').eq(active).addClass('active');
    }
};