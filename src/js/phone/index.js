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

    var _areModal;
    var areaModal = function () {
        if (!_areModal) {
            _areModal = $('#area-modal').modal({
                show: 'false',
                closeViaDimmer: false
            });
        }
        return _areModal;
    };

    function resize() {
        $form.width($header.width() - $cityLabel.width() - 50 + 'px');
    }

    $window.resize(resize);

    resize();

    app.controller('AppCtrl', ['$scope', '$http', function (scope, $http) {
        scope.city = undefined;
        scope.country = -1;
        scope.realCity = undefined;

        cityParse.get(function (result) {
            for(var i in scope.map) {
                scope.city = result.name;
                scope.realCity = scope.city;
                scope.country = -1;
                scope.$applyAsync();
            }
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
            getGoodsData();
        });

        $http
            .get('/user/shoppingcart')
            .success(function (data) {
                scope.shoppingCart = data;
                if(scope.goodsData.length !== 0) {
                    console.log('update');
                    updateShoppingNum();
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
                console.log(data);
            }
            scope.$applyAsync();
        }

        scope.loadMore = function () {
            var id = dataIndex(scope.searchMode);
            scope.pageData[id] ++;
            var updateStartIndex = scope.goodsData.length -1;
            getGoodsData();
            updateShoppingNum(updateStartIndex);
        };

        function stypeId() {
            return scope.types[scope.activeLTypeIndex].GoodsTypes[scope.activeSTypeIndex].id;
        }

        function dataIndex(mode){
            return mode ? scope.city + scope.country + scope.search:
                scope.city + scope.country + stypeId();
        }

        function getGoodsData () {
            if (typeof scope.city === 'undefined' || typeof scope.country === 'undefined') {
                return;
            }
            var searchMode = scope.searchMode;
            var id = dataIndex(searchMode);
            scope.pageData[id] = scope.pageData[id] || 1;
            scope.loadStatus = 1;
            var params = {};
            params.city = scope.city;
            params.country = scope.country === -1 ? undefined : scope.map[scope.city].countries[scope.country];
            params.page = scope.pageData[id];
            if (searchMode) {
                params.txt = scope.search;
            } else {
                params.stype = stypeId();
            }
            $http
                .post('/get-goods', params)
                .success(function (data) {
                    if (!scope.goodsCache[id]) {
                        scope.goodsCache[id] = [];
                    }
                    scope.goodsCache[id] = scope.goodsCache[id].concat(data);
                    if (data.length < 3) {
                        scope.loadStatus = 2;
                    } else {
                        scope.loadStatus = 0;
                    }
                    var updateStartIndex = 0;
                    if (params.page != 1) {
                        updateStartIndex = scope.goodsData.length;
                    }
                    scope.goodsData = scope.goodsCache[id];
                    updateShoppingNum(updateStartIndex);
                    scope.$applyAsync();
                });
        }

        (function () {
            var areas = JSON.parse(angular.element('#area').html());
            var mapDict = {};
            for(var i in areas) {
                var item = areas[i];
                if (!mapDict[item.city]) {
                    mapDict[item.city] = {}
                }
                mapDict[item.city][item.country] = 0;
            }
            var map = {};
            var cities = [];
            for(var i in mapDict) {
                var item = mapDict[i];
                map[i] = [];
                for(j in item) {
                    map[i].push(j);
                }
                cities.push(i);
            }
            scope.map = map;
            scope.cities = cities;
        }());

        scope.$watch('city', function () {
            getGoodsData();
            setTimeout(function () {
                resize();
            }, 0)
        });

        scope.$watch('[activeLTypeIndex,activeSTypeIndex]', function (newVals, oldvals) {
            scope.searchMode = false;
            var id = dataIndex(scope.searchMode);
            var cached = scope.goodsCache[id];
            if (cached) {
                scope.goodsData = cached;
                scope.$applyAsync();
            } else {
                scope.pageData[id] = 1;
                getGoodsData();
            }
        });

        window.s = scope;
    }]);

    app.controller('CityCtrl', ['$scope', function (scope) {

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

        $('#city-select').click(function () {
            areaModal().modal('close');
            modal().modal('open');
        });

        scope.selectRealCity = function () {
            scope.$parent.city = scope.realCity;
            scope.$parent.$applyAsync();
            modal().modal('close');
        };

        scope.$watch('filter', function (newVal, oldVal) {
            if (typeof newVal === 'undefined' || newVal === oldVal) {
                return;
            }
            scope.showed = scope.cities.filter(function (city) {
                return city.includes(newVal);
            });
            scope.$applyAsync();
        });
    }]);

    app.controller('AreaCtrl', ['$scope', function (scope) {

        scope.select = function (index) {
            scope.$parent.country = index;
            scope.$parent.$applyAsync();
            areaModal().modal('close');
        };

        $('.city-label').click(function () {
            areaModal().modal('open');
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
