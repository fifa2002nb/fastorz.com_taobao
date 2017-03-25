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
GLOBAL_CONFIG.onlineRouteUrlBase = '/static/templates/';
GLOBAL_CONFIG.onlineTemplateUrlBase = '/static/partials/';
GLOBAL_CONFIG.onlineCMSBase = 'http://api.fastorz.com:9000/';
// for offline
GLOBAL_CONFIG.offlineRouteUrlBase = '/static/templates/';
GLOBAL_CONFIG.offlineTemplateUrlBase = '/static/partials/';
GLOBAL_CONFIG.offlineCMSBase = 'http://127.0.0.1:9000/';
// for now
GLOBAL_CONFIG.nowRouteUrlBase = GLOBAL_CONFIG.onlineRouteUrlBase;
GLOBAL_CONFIG.nowTemplateUrlBase = GLOBAL_CONFIG.onlineTemplateUrlBase;
GLOBAL_CONFIG.nowCMSBase = GLOBAL_CONFIG.onlineCMSBase;
fastorz.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $httpProvider) {
        $locationProvider.html5Mode({ enabled: true, requireBase: false }); //html5 mode
        $urlRouterProvider.otherwise(GLOBAL_CONFIG.nowRouteUrlBase); // for path rewriter
        $stateProvider.
            state('show', {
            url: GLOBAL_CONFIG.nowRouteUrlBase,
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
        $scope.search = { searchKey: "", searching: false, searchLimit: 10, searchType: Math.round(Math.random() * 30) };
        $scope.base = 0;
        $scope.noMoreData = false;
        new Clipboard('.quan-btn');
        $scope.doRefresh = function (searching) {
            if (!searching) {
                $scope.search.searchType = Math.round(Math.random() * 30);
            }
            $scope.noMoreData = false;
            $scope.search.searching = searching;
            $scope.base = 0;
            var data = { key: $scope.search.searchKey, type: $scope.search.searchType, base: $scope.base, limit: $scope.search.searchLimit };
            $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
                .then(function (res) {
                if (0 == res.code) {
                    $scope.items = res.result;
                    if ($scope.search.searchLimit > $scope.items.length) {
                        $scope.noMoreData = true;
                    }
                }
                else {
                    console.log(res.result);
                }
                $scope.base = 1;
                $scope.$broadcast("scroll.refreshComplete");
                $scope.search.searching = false;
            }, function (err) {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.search.searching = false;
            });
        };
        $scope.loadMore = function () {
            $scope.noMoreData = false;
            var data = { key: $scope.search.searchKey, type: $scope.search.searchType, base: $scope.base, limit: $scope.search.searchLimit };
            $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
                .then(function (res) {
                if (0 == res.code) {
                    if ($scope.search.searchLimit > res.result.length) {
                        $scope.noMoreData = true;
                    }
                    for (var i = 0; i < res.result.length; i++) {
                        $scope.items.push(res.result[i]);
                    }
                }
                $scope.base++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }, function (err) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
        };
        $scope.showPopup = function () {
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
        $scope.doRefresh(false);
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
