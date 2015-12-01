/* css */
require('../../css/admin-base/global');
require('../../template_content/assets/plugins/select2/select2_metro.css');
require('../../css/admin-base/theme');

/* js */
require('./../admin-base/core.js');
var App = require('expose?App=App!imports?$=jquery!../../template_content/assets/scripts/app.js');

jQuery(document).ready(function() {
    App.init();
});

