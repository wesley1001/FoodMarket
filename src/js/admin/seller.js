/**
 * Created by li_rz on 2015/12/4.
 */

require('../../../src/css/admin-base/common.js');
require('./../admin-base/core.js');
require('../../../src/bower_components/angular/angular.min.js');
require('../../../src/css/admin/checkList.scss');
require('../../../src/js/angular.simple-datatables.js');

(function () {
    var check_list = angular.module('check_list', []);


    //check_list.config([
    //    '$routeProvider',
    //    '$locationProvider',
    //    function ($routeProvider, $locationProvider) {
    //        $routeProvider.when('#check', {
    //           controller: 'checkedCtrl'
    //        });
    //
    //        $routeProvider.when('#non-check', {
    //            controller: 'nonCheckCtrl'
    //        })
    //}]);


    check_list.controller('nonCheckCtrl', function ($scope, $http) {
        // console.log($route);
        $http
            .get('uncheck.json', {cache: true})
            .success(function (data) {
                $scope.uncheck_data = data;

                //$http
                //    .get('uncheck.json', {cache: true})
                //    .success(function (data) {
                //        $scope.uncheck_data = data;
                //        console.log(data);
                //    });
            });
        //console.log($route);

    });


    check_list.controller('checkedCtrl', function ($scope, $http) {
        $http
        .get('check.json', {cache: true})
        .success(function (data) {
            $scope.checked_data = data;
        });
    });

    //check_list.run([
    //    '$rootScope',
    //    '$location',
    //    function ($rootScope, $location) {
    //        $rootScope.path = $location.path();
    //        $rootScope.on('$routeChangeSuccess', function (newVal) {
    //            $rootScope.path = $location.path();
    //        });
    //}]);

    angular.bootstrap(document.documentElement, ['check_list']);
}());



//$('#seller-tab')
//    .find('a')
//    .click(function (event) {
//    event.preventDefault();
//    $(this).tab('show')
//});

