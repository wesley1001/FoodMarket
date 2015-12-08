/**
 * Created by li_rz on 2015/12/4.
 */

require('../../../src/css/admin-base/common.js');
require('./../admin-base/core.js');
require('../../../src/bower_components/angular/angular.min.js');
require('../../../src/css/admin/checkList.scss');
require('../../../src/js/angular.simple-datatables.js');

(function () {
    var check_list = angular.module('check_list', ['simpleDatatable']);

    /**
     *
     * @param $scope - Angular $scope
     * @param $http - Angular $http
     * 获取未审核用户数据
     */
    function getUncheckData ($scope, $http) {
        $http
            .get('uncheck.json', {cache: true})
            .success(function (data) {
                $scope.uncheck_data = data;
            });
    }

    /**
     *
     * @param $scope - Angular $scope
     * @param $http - Angular $http
     * 获取已审核用户数据
     */
    function getCheckedData ($scope, $http) {
        $http
            .get('check.json', {cache: true})
            .success(function (data) {
                $scope.checked_data = data;
            });
    }

    check_list.controller('nonCheckCtrl', function ($scope, $http) {
        getUncheckData($scope, $http);

        $scope.confirmSeller = function (data_id) {
            console.log(data_id);
            var flag = false;
            for (var i = 0; i < $scope.uncheck_data.length; ++i) {
                console.log($scope.uncheck_data[i]);
                if (data_id === $scope.uncheck_data[i].id) {
                    $http
                        .post('/adminer/checkList', {event: 'confirm', id: data_id})
                        .success(function () {
                            console.log('Success');
                            flag = true;

                            //getUncheckData($scope, $http);
                            //getCheckedData($scope, $http);
                        })
                        .error(function (error) {
                            throw error;
                        });
                    if (flag) {
                        $scope.checked_data.push($scope.uncheck_data[i]);
                        $scope.uncheck_data.splice(i, 1);
                    }
                    break;
                }
            }
        };

        $scope.deleteSeller = function (data_id) {
            var flag = false;
            for (var i = 0; i < $scope.uncheck_data.length; ++i) {
                console.log($scope.uncheck_data[i]);
                if (data_id === $scope.uncheck_data[i].id) {
                    $http
                        .post('/adminer/checkList', {event: 'delete', id: data_id})
                        .success(function () {
                            console.log('Success');
                            flag = true;
                        })
                        .error(function (error) {
                            throw error;
                        });
                    if (flag) {
                        $scope.uncheck_data.splice(i, 1);
                    }
                    break;
                }
            }
        };
    });


    check_list.controller('checkedCtrl', function ($scope, $http) {
        getCheckedData($scope, $http);
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





