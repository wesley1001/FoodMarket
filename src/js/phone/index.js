require('imports?$=jquery!amazeui/dist/css/amazeui.css');
require('../../css/phone/index.scss');
require('Swiper/dist/css/swiper.css');

require('Swiper/dist/js/swiper.js');
require('exports?window.angular!angular');

$(function (){

    var $window = $(window);
    var $header = $('.fixed-header');
    var $cityLabel = $('.city-label', $header);
    var $form = $('form', $header);

    var app = angular.module('app', []);
    var cityParse = new BMap.LocalCity();

    var mySwiper = new Swiper('.swiper-container', {

        freeMode : true,
        width: 140,
    });

    function resize() {
        $form.width($header.width() - $cityLabel.width() - 50 + 'px');
    }

    $window.resize(resize);

    resize();


    app.controller('AppCtrl', ['$scope', function (scope) {
        scope.city = '大连';
        scope.realCity;

        cityParse.get(function (result) {

            scope.city = result.name.substr(0, result.name.length - 1);
            scope.realCity = scope.city;
            scope.$applyAsync();
        });

        scope.$watch('city', function () {
            resize();
        });

    }]);

    app.controller('CityCtrl', ['$scope', function (scope) {

        scope.cities = ['大连', '北京'];
        scope.showed = angular.copy(scope.cities);

        var _modal;
        var modal = function () {
            if (!_modal) {
                _modal = $('#city-modal').modal({
                    show: 'false',
                    closeViaDimmer: false
                });
            }
            return _modal;
        };

        scope.select = function (index) {
            scope.$parent.city = scope.cities[index];
            scope.$parent.$applyAsync();
            modal().modal('close');
        };

        $('.city-label').click(function () {
            modal().modal('open');
        });

        scope.selectRealCity = function () {
            scope.$parent.city = scope.realCity;
            scope.$parent.$applyAsync();
            modal().modal('close');
        };

        scope.$watch('filter', function () {
            scope.showed = scope.cities.filter(function (city) {
                return city.includes(scope.filter);
            });
            scope.$applyAsync();
        });
    }]);

    app.controller('LTypeCtrl', ['$scope', function (scope)  {

        scope.active = 0;

        scope.$watch('active', function (){

        });

        angular.forEach(['next', 'prev'], function (action) {
            var func = 'slide' + action.substr(0, 1).toUpperCase() + action.substr(1);
            scope[action] = function () {
                mySwiper[func]();
            };
        });

        window.s = scope;
    }]);

    app.controller('STypeCtrl', ['$scope', function (scope)  {

        scope.data = ['根茎类', '很长的名字啊'];

        scope.active = 0;

        scope.$watch('active', function (){

        });

        angular.forEach(['next', 'prev'], function (action) {
            var func = 'slide' + action.substr(0, 1).toUpperCase() + action.substr(1);
            scope[action] = function () {
                mySwiper[func]();
            };
        });

        window.s = scope;
    }]);

    app.controller('GoodsCtrl', ['$scope', function (scope)  {

        scope.data = [
            {
                title: '黄皮洋葱',
                mainImg: '/tmp/1 (1).png',
                price: 12.4,
                soldNum: 10000,
                capacity: 100000,
                per: '袋(10斤)'
            },
            {
                title: '黄皮洋葱',
                mainImg: '/tmp/1 (2).png',
                price: 12.4,
                soldNum: 10000,
                capacity: 100000,
                per: '袋(10斤)'
            },
            {
                title: '黄皮洋葱',
                mainImg: '/tmp/1 (3).png',
                price: 12.4,
                soldNum: 10000,
                capacity: 100000,
                per: '袋(10斤)'
            },
            {
                title: '黄皮洋葱',
                mainImg: '/tmp/1 (3).png',
                price: 12.4,
                soldNum: 10000,
                capacity: 100000,
                per: '袋(10斤)'
            },
            {
                title: '黄皮洋葱',
                mainImg: '/tmp/1 (3).png',
                price: 12.4,
                soldNum: 10000,
                capacity: 100000,
                per: '袋(10斤)'
            },
        ];

    }]);

    app.controller('GoodsItemCtrl', ['$scope', function (scope)  {

        scope.goods;

    }]);

    angular.bootstrap(document.documentElement, ['app']);

});
