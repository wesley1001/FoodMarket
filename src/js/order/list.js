require('../../../src/css/admin-base/common.js');

/* js */
require('../admin/index');
/* webuplader */

require('exports?window.angular!imports?$=jquery!angular');
var moment = require('moment');
require('imports?$=jquery!jquery-validation');
require('eonasdan-bootstrap-datetimepicker');

var $ = jQuery;

var app = angular.module('app', []);

var ajaxErrorCb = function () {
    alert('操作失败，请刷新重试');
};

$(function () {
    $('.date-picker').find('input').datetimepicker({
        //locale: 'zh'
    });
});

app.filter('statusStr', function () {
    return function (val){
        switch (val) {
            case 0:
                return '';
            case 1:
                return '待发货';
        }
    };
});


app.controller('AppCtrl', ['$scope', function (scope) {

}]);

app.controller('OrderListCtrl', ['$scope', '$http', function (scope, $http) {

    scope.canload = true;
    scope.numPerPage = 25;
    scope.page = 1;
    scope.topPage = 1;
    scope.status = 1;
    scope.data = [];
    scope.list = [];
    scope.count = 0;
    scope.totalPage = 0;
    scope.loading = false;

    var daterange = angular.element('.input-large input');

    scope.get = function () {
        scope.loading = true;
        var page = scope.page;
        var start = scope.data.length;
        $http
            .post('/adminer/get-order', {
                page: scope.page,
                status: scope.status,
                first: page == 1,
                startDate: daterange.eq(0).val(),
                endDate: daterange.eq(1).val(),
                recieverName: scope.recieverName,
                phone: scope.phone,
                goodsIds: scope.goodsIds,
            })
            .success(function (data) {
                scope.loading = false;
                if (page == 1) {
                    scope.count = data.num;
                    scope.totalPage = Math.ceil(scope.count / (scope.numPerPage * 1.0));
                }
                data = data.orders;
                if (data.length < scope.numPerPage) {
                    scope.canload = false;
                }
                for(var i in data) {
                    data[i].opened = false;
                    data[i].payTime = moment(data[i].payTime).format("YY/MM/DD hh:mm:ss");
                }
                scope.data = scope.data.concat(data);
                scope.list = scope.data.slice(start, scope.data.length);
                scope.topPage = page;
                scope.$applyAsync();
            }).error(ajaxErrorCb);
    };

    scope.$watch('page', function (newVal, oldVal) {
        if (typeof newVal === 'undefined' || newVal == oldVal || newVal < 1){
            return;
        }
        if (newVal < scope.topPage) {
            scope.list = scope.data.slice((newVal - 1) * scope.numPerPage, newVal * scope.numPerPage);
        }else {
            scope.get();
        }
    });

    scope.search = function () {
        scope.data = [];
        scope.page = 1;
        scope.get();
    };

    scope.reset = function (){
        scope.goodsIds = [];
        scope.recieverName = '';
        scope.phone = '';
        daterange.eq(0).val('');
        daterange.eq(1).val('');
        scope.status = '';
    };

    scope.get();

    window.s = scope;

}]);

app.controller('OrderCtrl', ['$scope', '$http', function (scope, $http) {

    scope.$watch('order.opened', function (newVal, oldVal) {
        if (typeof newVal === 'undefined' || newVal == oldVal || newVal != true){
            return;
        }
        $http
            .get('/adminer/get-orderitem/' + scope.order.id)
            .success(function (data) {
                scope.order.orderItems = data;
            }).error(ajaxErrorCb);
    })

}]);

angular.bootstrap(document.documentElement, ['app']);


