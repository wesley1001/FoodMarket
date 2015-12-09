require('imports?$=jquery!amazeui/dist/css/amazeui.css');
require('../../css/phone/shoppingCart.scss');

require('exports?window.angular!angular');
require('./base.js').bottomBar(2);

var $ = jQuery;

$(function () {

});

var app = angular.module('app', []);

app.controller('AppCtrl', ['$scope', function (scope) {

    scope.shoppingCart = [];
    var src = JSON.parse(angular.element('#shoppingCart').html());
    var tmp = {};
    for(var i in src) {
        var item = src[i];
        var sellerId = item.SellerId;
        if (!tmp[sellerId]) {
            tmp[sellerId] = [];
        }
        tmp[sellerId].push({
            sellerId: sellerId,
            src: item,
            selected: false
        });
    }

    for(var i in tmp) {
        scope.shoppingCart.push({
            id: i,
            shopName: tmp[i][0].src.Good.Seller.shopName,
            goods: tmp[i],
            selected: false
        });
    }
    window.s = scope;

}]);

app.controller('ShopCtrl', ['$scope', function (scope) {

    scope.selectShop = function (index, selected) {
        scope.$parent.shoppingCart[index].selected = selected;
        var goods = scope.$parent.shoppingCart[index].goods;
        for(var i in goods) {
            goods[i].selected = selected;
        }
    };

}]);

app.controller('GoodsCtrl', ['$scope', '$http', function (scope, $http) {

    scope.selectGoods = function (index, selected) {
        scope.$parent.$parent.shoppingCart[scope.shopIndex].goods[scope.goodsIndex].selected = selected;
    };

    var timer;
    scope.add = function (delta) {
        var goods = scope.$parent.$parent.shoppingCart[scope.shopIndex].goods[scope.goodsIndex].src;
        if (goods.num + delta >= 0 ){
            goods.num += delta;
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                clearInterval(timer);
                $http.get('/user/shoppingcart/' + goods.GoodId + '/' + goods.num);
            },  500);
        }
    };

    scope.remove = function () {
        var goods = scope.$parent.$parent.shoppingCart[scope.shopIndex].goods.splice(scope.goodsIndex, 1)[0].src;
        $http.get('/user/shoppingcart/' + goods.GoodId + '/-1');
    };
}]);

angular.bootstrap(document.documentElement, ['app']);