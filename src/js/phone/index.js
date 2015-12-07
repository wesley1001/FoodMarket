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

    var mySwiper;

    function resize() {
        $form.width($header.width() - $cityLabel.width() - 50 + 'px');
    }

    $window.resize(resize);

    resize();

    app.controller('AppCtrl', ['$scope', '$http', function (scope, $http) {
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

        var typesStr = angular.element('#types').html();
        scope.types = typesStr ? JSON.parse(typesStr) : [];

        scope.activeLTypeIndex = 0;

        scope.activeSTypeIndex = 0;

        scope.goodsData = [];

        scope.goodsCache = {

        };

        scope.shoppingCart = undefined;

        $http
            .get('/user/shoppingcart')
            .success(function (data) {
                scope.shoppingCart = data;
                if(scope.goodsData.length !== 0) {
                    updateShoppingNum();
                }
            });

        scope.$watch('[activeLTypeIndex,activeSTypeIndex]', function (newVals, oldvals) {
            var id = scope.types[newVals[0]].GoodsTypes[newVals[1]].id;
            var cached = scope.goodsCache[id];
            if (cached) {
                scope.goodsData = cached;
            } else {
                $http
                    .get('/' + id + '/goods')
                    .success(function (data) {
                        scope.goodsCache[id] = data;
                        scope.goodsData = scope.goodsCache[id];
                        if (scope.shoppingCart && scope.shoppingCart.length !== 0) {
                            updateShoppingNum();
                        }
                        scope.$applyAsync();
                    });
            }
        });

        scope.$applyAsync();

        function updateShoppingNum() {
            for(var j in scope.goodsData) {
                var data = scope.goodsData[j];
                for(var i in scope.shoppingCart) {
                    var item = scope.shoppingCart[i];
                    if (item.GoodId == data.id) {
                        console.log('hit');
                        data.num = item.num;
                        break;
                    }
                }
                if(!data.num) {
                    data.num = 0;
                }
            }
            scope.$applyAsync();
        }


        window.s = scope;
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

    app.controller('LTypeCtrl', ['$scope', '$http', function (scope, $http)  {

        angular.forEach(['next', 'prev'], function (action) {
            var func = 'slide' + action.substr(0, 1).toUpperCase() + action.substr(1);
            scope[action] = function () {
                mySwiper[func]();
            };
        });

        setTimeout(function () {
            mySwiper =  new Swiper('.swiper-container', {
                freeMode : true,
                width: 120
            });

        }, 0);

        scope.setLType = function (index) {
            scope.$parent.activeLTypeIndex = index;
        };
    }]);

    app.controller('STypeCtrl', ['$scope', function (scope)  {

        scope.setSType = function (index) {
            scope.$parent.activeSTypeIndex = index;
        };
    }]);

    app.controller('GoodsCtrl', ['$scope', '$http', function (scope, $http)  {

    }]);

    app.controller('GoodsItemCtrl', ['$scope', '$http', function (scope, $http)  {


        var timer;
        scope.add = function (delta) {
            var goods = scope.goodsData[scope.index];
            if (goods.num + delta > 0 ){
                goods.num += delta;
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    clearInterval(timer);
                    $http.get('/user/shoppingcart/' + goods.id + '/' + goods.num);
                },  1000);
            }
        };
    }]);

    angular.bootstrap(document.documentElement, ['app']);

});
