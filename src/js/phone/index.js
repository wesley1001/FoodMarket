require('imports?$=jquery!amazeui/dist/css/amazeui.css');
require('../../css/phone/index.scss');
require('Swiper/dist/css/swiper.css');

require('Swiper/dist/js/swiper.js');
require('exports?window.angular!angular');
require('ngInfiniteScroll');
var phoneBase = require('./base.js');

$(function (){

    phoneBase.bottomBar(0);

    var $window = $(window);
    var $header = $('.fixed-header');
    var $cityLabel = $('.city-label', $header);
    var $form = $('form', $header);

    var app = angular.module('app', ['infinite-scroll']);
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

        scope.pageData = {};

        scope.shoppingCart = undefined;

        scope.loadStatus = 0;

        scope.searchMode = false;
        scope.searchCache = {};

        angular.element('#search').on('keydown', function (e) {
            if (e.keyCode != 13) {
                return;
            }
            scope.searchMode = true;
            scope.pageData[scope.search] = 1;
            getGoodsData(undefined, 1, scope.search);
        });

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
                scope.$applyAsync();
            } else {
                scope.pageData[id] = 1;
                getGoodsData(id, 1);
            }
        });

        scope.$applyAsync();

        function updateShoppingNum(start, end) {
            if (typeof start === 'undefined') {
                start = 0;
            }
            if (typeof end === 'undefined') {
                end = scope.goodsData.length -1;
            }
            for(var j in scope.goodsData) {
                if (j < start || j > end ) {
                    continue;
                }
                var data = scope.goodsData[j];
                for(var i in scope.shoppingCart) {
                    var item = scope.shoppingCart[i];
                    if (item.GoodId == data.id) {
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

        scope.loadMore = function () {
            var id;
            var updateStartIndex = scope.goodsData.length -1;
            if (!scope.searchMode) {
                id = scope.types[scope.activeLTypeIndex].GoodsTypes[scope.activeSTypeIndex].id;
                getGoodsData(id, ++scope.pageData[id]);
            } else {
                getGoodsData(undefined, ++scope.pageData[scope.search], scope.search);
            }
            updateShoppingNum(updateStartIndex);
        };

        function getGoodsData (id, page, txt) {
            scope.loadStatus = 1;
            var url = txt ? ('/goods-search/' + txt + '/' + page) : ('/' + id + '/goods/' + page);
            $http
                .get(url)
                .success(function (data) {
                    var src;
                    if (txt) {
                        scope.searchCache[txt] = data;
                        src = scope.searchCache[txt];
                    } else {
                        scope.goodsCache[id] = data;
                        src = scope.goodsCache[id];
                    }
                    if (data.length < 20) {
                        scope.loadStatus = 2;
                    } else {
                        scope.loadStatus = 0;
                    }
                    var updateStartIndex;
                    if (page == 1) {
                        updateStartIndex = 0;
                        scope.goodsData = src;
                    } else {
                        updateStartIndex = scope.goodsData.length;
                        scope.goodsData = scope.goodsData.concat(src);
                    }
                    if (scope.shoppingCart && scope.shoppingCart.length !== 0) {
                        updateShoppingNum(updateStartIndex);
                    }
                    scope.$applyAsync();
                });
        }

        scope.area = JSON.parse(angular.element('#area').html());

        window.s = scope;
    }]);

    app.controller('CityCtrl', ['$scope', function (scope) {

        scope.cities = ['大连', '北京'];
        //scope.showed = sco;

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
            scope.$parent.seachMode = false;
            scope.$parent.$applyAsync();
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
            if (goods.num + delta >= 0 ){
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
