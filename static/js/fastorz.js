/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="typings/angular-translate/angular-translate.d.ts" />
/// <reference path="typings/angularjs/angular-sanitize.d.ts" />
/// <reference path="typings/angularjs/angular-animate.d.ts" />
/// <reference path="typings/ionic/ionic.d.ts" />
/// <reference path="typings/clipboard/clipboard.d.ts" />
var fastorz = angular.module('FastORZ', [
    'ui.router',
    'fastorzControllers',
    'pascalprecht.translate',
    'ionic',
    'akoenig.deckgrid',
    'ionicLazyLoad'
]);
var GLOBAL_CONFIG = (function () {
    function GLOBAL_CONFIG() {
    }
    return GLOBAL_CONFIG;
}());
// for online
GLOBAL_CONFIG.onlineRouteUrlBase = '/';
GLOBAL_CONFIG.onlineTemplateUrlBase = '/static/partials/';
GLOBAL_CONFIG.onlineCMSBase = 'http://www.sodeyixia.xyz:9000/';
// for offline
GLOBAL_CONFIG.offlineRouteUrlBase = '/static/templates/';
GLOBAL_CONFIG.offlineTemplateUrlBase = '/static/partials/';
GLOBAL_CONFIG.offlineCMSBase = 'http://www.sodeyixia.xyz:9000/';
// for now
GLOBAL_CONFIG.nowRouteUrlBase = GLOBAL_CONFIG.onlineRouteUrlBase;
GLOBAL_CONFIG.nowTemplateUrlBase = GLOBAL_CONFIG.onlineTemplateUrlBase;
GLOBAL_CONFIG.nowCMSBase = GLOBAL_CONFIG.onlineCMSBase;
fastorz.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $httpProvider) {
        $locationProvider.html5Mode({ enabled: true, requireBase: false }); //html5 mode
        $urlRouterProvider.otherwise(GLOBAL_CONFIG.nowRouteUrlBase); // for path rewriter
        $stateProvider.
            state('sodeyixia', {
            url: GLOBAL_CONFIG.nowRouteUrlBase,
            data: {
                title: 'sodeyixia'
            },
            templateUrl: GLOBAL_CONFIG.nowTemplateUrlBase + 'base.html',
            controller: 'BaseCtrl'
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
fastorzControllers.controller('FastORZCtrl', ['$scope', '$translate', '$http', '$q', '$filter', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', function ($scope, $translate, $http, $q, $filter, $window, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
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
        $scope.scrollToTop = function (whoseScroll) {
            $ionicScrollDelegate.$getByHandle(whoseScroll).scrollTop();
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
var productItem = (function () {
    function productItem() {
    }
    return productItem;
}());
var darenItem = (function () {
    function darenItem() {
    }
    return darenItem;
}());
fastorzControllers.controller('BaseCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', '$window', function ($scope, $state, $timeout, $sce, $q, $http, $ionicPopup, $window) {
        $scope.productItems = [];
        $scope.productSearch = { searchKey: "", searching: false, searchLimit: 20, searchType: Math.round(Math.random() * 30) };
        $scope.productBase = 0;
        $scope.productNoMoreData = false;
        $scope.darenItems = [];
        $scope.darenSearch = { searchKey: "", searching: false, searchLimit: 20, searchType: Math.round(Math.random() * 30) };
        $scope.darenBase = 0;
        $scope.darenNoMoreData = false;
        $scope.darenStatus = { showDetail: false, currDaren: null };
        $scope.tmallIcon = "http://auz.qnl1.com/open/quan/images/taobao.png";
        if (/(iPhone|iPad|iPod|iOS)/i.test($window.navigator.userAgent)) {
            $scope.deviceType = "ios";
        }
        else if (/(Android)/i.test($window.navigator.userAgent)) {
            $scope.deviceType = "android";
        }
        else {
            $scope.deviceType = "pc";
        }
        ;
        new Clipboard('.quan-btn');
        $scope.productDoRefresh = function (searching) {
            if (!searching) {
                $scope.productSearch.searchType = Math.round(Math.random() * 30);
            }
            $scope.productNoMoreData = false;
            $scope.productSearch.searching = searching;
            $scope.productBase = 0;
            var data = { key: $scope.productSearch.searchKey, type: $scope.productSearch.searchType, base: $scope.productBase, limit: $scope.productSearch.searchLimit, device: $scope.deviceType };
            $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
                .then(function (res) {
                if (0 == res.code) {
                    $scope.productItems = res.result;
                    if ($scope.productSearch.searchLimit > $scope.productItems.length) {
                        $scope.productNoMoreData = true;
                    }
                }
                else {
                    console.log(res.result);
                }
                $scope.productBase = 1;
                $scope.$broadcast("scroll.refreshComplete");
                $scope.productSearch.searching = false;
            }, function (err) {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.productSearch.searching = false;
            });
        };
        $scope.productLoadMore = function () {
            $scope.productNoMoreData = false;
            var data = { key: $scope.productSearch.searchKey, type: $scope.productSearch.searchType, base: $scope.productBase, limit: $scope.productSearch.searchLimit, device: $scope.deviceType };
            $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
                .then(function (res) {
                if (0 == res.code) {
                    if ($scope.productSearch.searchLimit > res.result.length) {
                        $scope.productNoMoreData = true;
                    }
                    for (var i = 0; i < res.result.length; i++) {
                        $scope.productItems.push(res.result[i]);
                    }
                }
                $scope.productBase++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }, function (err) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
        };
        $scope.productShowPopup = function (quan) {
            if ("pc" != $scope.deviceType) {
                var myPopup = $ionicPopup.show({
                    template: '<div style="text-align: center;">请打开【手机淘宝APP】领券下单。</div>',
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
            }
            else {
                $window.open(quan);
            }
        };
        $scope.productDoRefresh(false);
        $scope.darenDoRefresh = function (searching) {
            if (!searching) {
                $scope.darenSearch.searchType = Math.round(Math.random() * 30);
            }
            $scope.darenStatus.showDetail = false;
            $scope.darenNoMoreData = false;
            $scope.darenSearch.searching = searching;
            $scope.darenBase = 0;
            var data = { key: $scope.darenSearch.searchKey, type: $scope.darenSearch.searchType, base: $scope.darenBase, limit: $scope.darenSearch.searchLimit, device: $scope.deviceType };
            $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/darens", data)
                .then(function (res) {
                if (0 == res.code) {
                    $scope.darenItems = res.result;
                    if ($scope.darenSearch.searchLimit > $scope.darenItems.length) {
                        $scope.darenNoMoreData = true;
                    }
                }
                else {
                    console.log(res.result);
                }
                $scope.darenBase = 1;
                $scope.$broadcast("scroll.refreshComplete");
                $scope.darenSearch.searching = false;
            }, function (err) {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.darenSearch.searching = false;
            });
        };
        $scope.darenLoadMore = function () {
            $scope.darenStatus.showDetail = false;
            $scope.darenNoMoreData = false;
            var data = { key: $scope.darenSearch.searchKey, type: $scope.darenSearch.searchType, base: $scope.darenBase, limit: $scope.darenSearch.searchLimit, device: $scope.deviceType };
            $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/darens", data)
                .then(function (res) {
                if (0 == res.code) {
                    if ($scope.darenSearch.searchLimit > res.result.length) {
                        $scope.darenNoMoreData = true;
                    }
                    for (var i = 0; i < res.result.length; i++) {
                        $scope.darenItems.push(res.result[i]);
                    }
                }
                $scope.darenBase++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }, function (err) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
        };
        $scope.darenDetail = function (id) {
            $scope.darenStatus.showDetail = true;
            $scope.darenStatus.currDaren = null;
            $scope.resourceFetcher(GLOBAL_CONFIG.nowCMSBase + "v1/daren?id=" + id)
                .then(function (res) {
                if (0 == res.code) {
                    $scope.darenStatus.currDaren = res.result;
                }
                else {
                    console.log(res);
                }
            }, function (err) {
                console.log(err);
            });
        };
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
