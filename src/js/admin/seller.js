require('./../admin-base/common.js');
require('angular');
require('angular-route');
require('../../../src/css/admin/checkList.scss');
require('../angular.simple-datatables.js');

var app = angular.module('checkList', ['simpleDatatable', 'ngRoute']);


var getUserData = function ($http, scope, status) {
    if (status === -1 ? !scope.data.uncheck : !scope.data.checked) {
        $http
            .get('/adminer/seller-admin/' + status)
            .success(function (data) {
                if (status === -1) {
                    scope.data.uncheck = data;
                    scope.list = scope.data.uncheck;
                } else {
                    scope.data.checked = data;
                    scope.list = scope.data.checked;
                }
                scope.$applyAsync();
            })
    } else {
        scope.list = status === -1 ? scope.data.uncheck : scope.data.checked;
        scope.$applyAsync();
    }
};

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/uncheck', {
            template: '',
            controller: 'UncheckCtrl'
        })
        .when('/checked', {
            template: '',
            controller: 'CheckedCtrl'
        })
        .otherwise({
            redirectTo: '/uncheck'
        });
}]);


app.controller('AppCtrl', ['$scope', '$http', function (scope, $http) {
    scope.tab = undefined;

    scope.data = {
    };

    scope.list = [];

    scope.$watch('tab', function (newVal, oldVal){
        if (newVal == oldVal && typeof newVal !== 'undefined') {
            return;
        }
        scope.actionColFactory =  scope.actionColFactories[newVal + 1];
        getUserData($http, scope, newVal);

    });

    scope.sdtOn = function (event, row) {
        var extraParams = Array.prototype.slice.call(arguments, 2);
        var status = 0;
        var remover = extraParams[1];
        if (extraParams[0] === 'pass') {
            status = 0;
        } else if (extraParams[0] === 'reject') {
            status = -2;
            if (scope.data.check) {
                scope.data.push(row);
            }
        }
        $http
            .post('/adminer/seller-admin-action', {
                id: row.id,
                status: status.toString()
            })
            .success(function (ret) {
                if (ret.status) {
                    remover();
                    if (status === -2 && scope.data.checked) {
                        scope.data.checked.push(row);
                        scope.$applyAsync();
                    }
                }
            })
            .error(function () {
                alert('操作失败，请刷新重试');
            });
    };

    scope.actionColFactories = [angular.element('#uncheck-btn').html(), angular.element('#checked-btn').html()]
    scope.actionColFactory =  scope.actionColFactories[0];
    //scope.actionColFactory = angular.element('#uncheck-btn').html();

    window.s = scope;
}]);

app.controller('UncheckCtrl', ['$scope', function (scope) {
    scope.$parent.tab = -1;
}]);

app.controller('CheckedCtrl', ['$scope', function (scope) {
    scope.$parent.tab = 0;
}]);

//app.controller('nonCheckCtrl', function ($scope, $http) {
//
//    //$scope.confirmSeller = function (data_id) {
//    //    var flag = false;
//    //    for (var i = 0; i < $scope.uncheck_data.length; ++i) {
//    //        console.log($scope.uncheck_data[i]);
//    //        if (data_id === $scope.uncheck_data[i].id) {
//    //            $http
//    //                .post('/adminer/checkList', {event: 'confirm', id: data_id})
//    //                .success(function () {
//    //                    console.log('Success');
//    //                    flag = true;
//    //                })
//    //                .error(function (error) {
//    //                    throw error;
//    //                });
//    //            if (flag) {
//    //                $scope.checked_data.push($scope.uncheck_data[i]);
//    //                $scope.uncheck_data.splice(i, 1);
//    //            }
//    //            break;
//    //        }
//    //    }
//    //};
//});

angular.bootstrap(document.documentElement, ['checkList']);





