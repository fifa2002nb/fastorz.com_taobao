/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="typings/angular-translate/angular-translate.d.ts" />
/// <reference path="typings/angularjs/angular-sanitize.d.ts" />
/// <reference path="typings/angularjs/angular-animate.d.ts" />
/// <reference path="typings/ionic/ionic.d.ts" />
/// <reference path="typings/angular-clipboard/angular-clipboard.d.ts" />
var fastorz = angular.module('FastORZ', [
    'ui.router',
    'fastorzControllers',
    'pascalprecht.translate',
    'ionic',
    'angular-clipboard',
    'akoenig.deckgrid'
]);
var GLOBAL_CONFIG = (function () {
    function GLOBAL_CONFIG() {
    }
    return GLOBAL_CONFIG;
}());
// for online
GLOBAL_CONFIG.onlineRouteUrlBase = '/static/templates/';
GLOBAL_CONFIG.onlineTemplateUrlBase = '/static/partials/';
GLOBAL_CONFIG.onlineCMSBase = 'http://www.apmbe.com:9000/';
// for offline
GLOBAL_CONFIG.offlineRouteUrlBase = '/static/templates/';
GLOBAL_CONFIG.offlineTemplateUrlBase = '/static/partials/';
GLOBAL_CONFIG.offlineCMSBase = 'http://127.0.0.1:9000/';
// for now
GLOBAL_CONFIG.nowRouteUrlBase = GLOBAL_CONFIG.offlineRouteUrlBase;
GLOBAL_CONFIG.nowTemplateUrlBase = GLOBAL_CONFIG.offlineTemplateUrlBase;
GLOBAL_CONFIG.nowCMSBase = GLOBAL_CONFIG.offlineCMSBase;
fastorz.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $httpProvider) {
        $locationProvider.html5Mode({ enabled: true, requireBase: false }); //html5 mode
        $urlRouterProvider.otherwise(GLOBAL_CONFIG.nowRouteUrlBase + 'show/'); // for path rewriter
        $stateProvider.
            state('show', {
            url: GLOBAL_CONFIG.nowRouteUrlBase + 'show/',
            templateUrl: 'show.html',
            controller: 'ShowCtrl',
            data: {
                title: 'Show'
            }
        });
        //设置国际化相关配置
        var lang = 'en';
        $translateProvider.preferredLanguage(lang);
        $translateProvider.useStaticFilesLoader({
            prefix: '/static/i18n/',
            suffix: '.json'
        });
    }]);
fastorz.run(['$location', '$rootScope', function ($location, $rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.title = toState.data.title;
            $rootScope.shortlink = false;
        });
    }]);
var fastorzControllers = angular.module('fastorzControllers', []);
fastorzControllers.controller('FastORZCtrl', ['$scope', '$translate', '$http', '$q', '$filter', '$window', '$ionicSlideBoxDelegate', function ($scope, $translate, $http, $q, $filter, $window, $ionicSlideBoxDelegate) {
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { });
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) { });
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };
        $scope.values = {};
        $scope.setKey = function (key, value) {
            if (value === undefined) {
                delete $scope.values[key];
            }
            else {
                $scope.values[key] = value;
            }
        };
        $scope.getKey = function (key) {
            return $scope.values[key];
        };
        $scope.repeatDone = function () {
            $ionicSlideBoxDelegate.update();
        };
        $scope.resourceFetcher = function (url) {
            var d = $q.defer();
            var p = $http({
                url: url,
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .success(function (data) {
                d.resolve(data);
            })
                .error(function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        $scope.resourcePusher = function (url, data) {
            var d = $q.defer();
            var p = $http({
                url: url,
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            })
                .success(function (res) {
                d.resolve(res);
            }).
                error(function (err) {
                d.reject(err);
            });
            return d.promise;
        };
    }]);
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name, "", -1);
}
function getUser() {
    return readCookie('action-user');
}
function setUser(name) {
    createCookie('action-user', name, 1000);
}
var showItem = (function () {
    function showItem() {
    }
    return showItem;
}());
fastorzControllers.controller('ShowCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', function ($scope, $state, $timeout, $sce, $q, $http, $ionicPopup) {
        $scope.items = [];
        $scope.search = { searchKey: null, searching: false };
        $scope.base = 0;
        $scope.noMoreData = false;
        var fakeItems = [];
        for (var i = 0; i < 100; i++) {
            fakeItems.push({ Title: "aaaa" + i, Image: "http://image.taobao.com/bao/uploaded/i4/TB1BpdNPFXXXXaPXpXXXXXXXXXX_!!2-item_pic.png", MarketPrice: 999.5 + i, DiscountPrice: 555.2 + i, SavePrice: 999.5 - 555.5, SellNum: 567 + i, Quan: "zzzzz" + i });
        }
        $scope.doRefresh = function () {
            $scope.items = fakeItems;
            return;
            /*$scope.noMoreData = false;
            $scope.search.searching = true;
            $scope.resourceFetcher(GLOBAL_CONFIG.nowCMSBase + "api/products.json?scopes=True&page=1")
                .then((items: showItem[]) => {
                    if(20 > items.length) $scope.noMoreData = true;
                    $scope.items = [];
                    for(var i = 0; i < items.length; i++ ){
                        var item = items[i];
                        var index = item.Imgs.Image.lastIndexOf('.');
                        var imageUrl = item.Imgs.Image.substring(0, index + 1);
                        var imageType = item.Imgs.Image.substring(index + 1)
                        item.Imgs.Image = GLOBAL_CONFIG.nowCMSBase + imageUrl + "small." + imageType;
                        $scope.items.push(item);
                    }
                    $scope.base = 1;
                    $scope.$broadcast("scroll.refreshComplete");
                    $scope.search.searching = false;
                }, (err: any) => {
                    $scope.$broadcast("scroll.refreshComplete");
                    $scope.search.searching = false;
                });
               */
        };
        $scope.loadMore = function () {
            $scope.items = fakeItems;
            return;
            /*
            $scope.noMoreData = false;
            $scope.base++;
            $scope.resourceFetcher(GLOBAL_CONFIG.nowCMSBase + "api/products.json?scopes=True&page=" + $scope.base)
                .then((items: showItem[]) => {
                    if(20 > items.length) $scope.noMoreData = true;
                    for(var i = 0; i < items.length; i++ ){
                        var item = items[i];
                        var index = item.Imgs.Image.lastIndexOf('.');
                        var imageUrl = item.Imgs.Image.substring(0, index + 1);
                        var imageType = item.Imgs.Image.substring(index + 1)
                        item.Imgs.Image = GLOBAL_CONFIG.nowCMSBase + imageUrl + "small." + imageType;
                        $scope.items.push(item);
                    }
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }, (err: any) => {
                    $scope.$broadcast("scroll.infiniteScrollComplete")
                    });
                    */
        };
        $scope.showPopup = function () {
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<div style="text-align: center;">请打开手机淘宝APP领券下单。</div>',
                title: '已复制淘口令',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>知道了</b>',
                        type: 'button-stable'
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
        $scope.doRefresh();
    }]);
fastorz.directive('repeatDone', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            scope.$eval(attrs.repeatDone);
        }
    };
});
fastorz.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });
                event.preventDefault();
            }
        });
    };
});
