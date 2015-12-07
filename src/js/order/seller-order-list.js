
require('../../../src/css/admin-base/common.js');

/* js */
require('../admin/index');
/* webuplader */

require('exports?window.angular!angular');
require('imports?$=jquery!jquery-validation');
require('../angular.simple-datatables.js');

var $ = jQuery;

$(function () {
    var app = angular.module('app', ['simpleDatatable', 'ngRoute']);

    app.controller('AppCtrl', ['$scope', function (scope) {

    }]);

    angular.bootstrap(document.documentElement, ['app']);
});