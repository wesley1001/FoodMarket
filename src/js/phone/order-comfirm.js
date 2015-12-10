require('imports?$=jquery!amazeui/dist/css/amazeui.css');
require('../../css/phone/order-comfirm.scss');

require('exports?window.angular!angular');

var $ = jQuery;

var app = angular.module('app', []);

app.controller('AppCtrl', ['$scope', '$http', function (scope, $http) {

    scope.shoppingCart = [];
    var src = JSON.parse(angular.element('#shoppingCart').html());

    (function () {

        var tmp = {};
        for(var i in src) {
            var item = src[i];
            var sellerId = item.Good.SellerId;
            if (!tmp[sellerId]) {
                tmp[sellerId] = [];
            }
            tmp[sellerId].push({
                sellerId: sellerId,
                src: item,
            });
        }

        var tmpArr = [];

        for(var i in tmp) {
            tmpArr.push({
                id: i,
                shopName: tmp[i][0].src.Good.Seller.shopName,
                goods: tmp[i],
                msg: ''
            });
        }

        for(var i in tmpArr) {
            var price = 0;
            for(var j in tmpArr[i].goods){
                price += tmpArr[i].goods[j].src.Good.price;
            }
            tmpArr[i].price = price;
        }

        scope.shoppingCart = tmpArr;
    }());

    scope.totalPrice = cal();

    function cal() {
        var fee = 0;
        for(var i in scope.shoppingCart) {
            var shop = scope.shoppingCart[i];
            for(var j in shop.goods) {
                var goods = shop.goods[j];
                fee += goods.src.Good.price * goods.src.num;
            }
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
        var order = scope.shoppingCart.map(function (shop) {
            return {
                id: shop.id,
                msg: shop.msg,
                goods: shop.goods.map(function (item) {
                    return {
                        id: item.src.id,
                        num: item.src.num
                    }
                })
            }
        });
        var form = angular.element('#order-form');
        form.find('[name=order]').val(JSON.stringify(order));
        form.find('[name=address]').val(scope.address[scope.addressIndex].id);
        form.submit();
    };

    window.s = scope;

    scope.changeAddress = function () {
        scope.$broadcast('address-modal');
    };
}]);

app.controller('ShopCtrl', ['$scope', function (scope) {
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