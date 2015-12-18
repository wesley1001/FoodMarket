require('imports?$=jquery!amazeui/dist/css/amazeui.css');
require('../../css/phone/order-comfirm.scss');

require('exports?window.angular!angular');

var $ = jQuery;

var app = angular.module('app', []);

app.controller('AppCtrl', ['$scope', '$http', function (scope, $http) {

    scope.msg = '';

    scope.shoppingCart = [];
    var src = JSON.parse(angular.element('#shoppingCart').html());

    scope.shoppingCart = src;

    scope.totalPrice = cal();

    function cal() {
        var fee = 0;
        for(var i in scope.shoppingCart) {
            var goods = scope.shoppingCart[i];
            fee += goods.Good.price * goods.num;
        }
        return fee;
    }

    scope.address = JSON.parse(angular.element('#addresses').html());
    scope.addressIndex = 0;
    (function () {
        for(var i in scope.address) {
            if (scope.address[i].isDefault) {
                var defaultAddress = scope.address.splice(i,  1);
                scope.address = defaultAddress.concat(scope.address);
                scope.$applyAsync();
                break;
            }
        }
    }());

    var submit = false;
    scope.buy = function () {
        if (submit) {
            return;
        }
        submit = true;
        var order = scope.shoppingCart.map(function (item) {
            return {
                id: item.id,
                num: item.num
            }
        });
        var form = angular.element('#order-form');
        form.find('[name=order]').val(JSON.stringify(order));
        form.find('[name=address]').val(scope.address[scope.addressIndex].id);
        form.find('[name=msg]').val(scope.msg);
        form.submit();
    };

    window.s = scope;

    scope.changeAddress = function () {
        scope.$broadcast('address-modal');
    };
}]);


app.controller('GoodsCtrl', ['$scope', '$http', function (scope, $http) {
}]);

app.controller('AddressCtrl', ['$scope', '$http', function (scope, $http) {
    var _modal = undefined;
    var modal = function () {
        if (!_modal) {
            _modal = angular.element('#address-modal').modal({

            });
        }
        return _modal;
    };

    scope.$on('address-modal', function () {
        modal().modal('open');
    });

    scope.setAddr = function (index) {
        scope.$parent.addressIndex = index;
        modal().modal('close');
    }
}]);

angular.bootstrap(document.documentElement, ['app']);