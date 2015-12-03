//css
require('../../template_content/assets/plugins/font-awesome/css/font-awesome.min.css');
require('../../template_content/assets/plugins/bootstrap/css/bootstrap.min.css');
require('../../template_content/assets/plugins/uniform/css/uniform.default.css');
require('../../template_content/assets/plugins/select2/select2_metro.css');
require('../../template_content/assets/css/style-metronic.css');
require('../../template_content/assets/css/style.css');
require('../../template_content/assets/css/style-responsive.css');
require('../../template_content/assets/css/plugins.css');
require('../../template_content/assets/css/themes/default.css');
require('../../template_content/assets/css/pages/login.css');
require('../../template_content/assets/css/custom.css');


//core js
var $ = require('expose?jQuery!jquery');
jQuery = $;
require('imports?$=jquery!../../template_content/assets/plugins/jquery-migrate-1.2.1.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/bootstrap/js/bootstrap.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/bootstrap-hover-dropdown/twitter-bootstrap-hover-dropdown.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/jquery.blockui.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/jquery.cookie.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/uniform/jquery.uniform.min.js');

//page js
require('imports?$=jquery!../../template_content/assets/plugins/jquery-validation/dist/jquery.validate.min.js');
require('imports?$=jquery!../../template_content/assets/plugins/select2/select2.min.js');


var App = require('expose?App=App!imports?$=jquery!../../template_content/assets/scripts/app.js');
var Login = require('expose?Login=Login!imports?$=jquery!../../template_content/assets/scripts/login.js');
jQuery(document).ready(function() {
    App.init();
    Login.init();
});


