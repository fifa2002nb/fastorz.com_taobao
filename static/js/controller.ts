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
    
class GLOBAL_CONFIG{
    // for online
    static onlineRouteUrlBase: string = '/';
    static onlineTemplateUrlBase: string = '/static/partials/';
    static onlineCMSBase: string = 'http://www.sodeyixia.xyz:9000/';
    // for offline
    static offlineRouteUrlBase: string = '/static/templates/';
    static offlineTemplateUrlBase: string = '/static/partials/';
    static offlineCMSBase: string = 'http://www.sodeyixia.xyz:9000/';
    // for now
    static nowRouteUrlBase: string = GLOBAL_CONFIG.onlineRouteUrlBase;
    static nowTemplateUrlBase: string = GLOBAL_CONFIG.onlineTemplateUrlBase;
    static nowCMSBase: string = GLOBAL_CONFIG.onlineCMSBase;
}
   
fastorz.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider', '$httpProvider', '$ionicConfigProvider', function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $locationProvider: ng.ILocationProvider, $translateProvider: angular.translate.ITranslateProvider, $httpProvider: ng.IHttpProvider, $ionicConfigProvider: ionic.utility.IonicConfigProvider){
    $locationProvider.html5Mode({enabled: true, requireBase: false}); //html5 mode
    $urlRouterProvider.otherwise(GLOBAL_CONFIG.nowRouteUrlBase); // for path rewriter
    $stateProvider.
        state('sodeyixia', {
            url: GLOBAL_CONFIG.nowRouteUrlBase,              
            data: {
                title: 'sodeyixia',
            }, 
            templateUrl: GLOBAL_CONFIG.nowTemplateUrlBase + 'base.html',
            controller: 'BaseCtrl',
        });

    //设置国际化相关配置
    var lang = 'en';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: '/static/i18n/',
        suffix: '.json'
    });
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.transition('ios');
}]);

interface IRootScope extends ng.IScope {
    title: string;
    shortlink: boolean;
}

fastorz.run(['$location', '$rootScope', function($location: ng.ILocationService, $rootScope: IRootScope) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.title = toState.data.title;
        $rootScope.shortlink = false;
    });

}]);

interface IFastORZScope extends IRootScope {
    setKey: (key: string, value: any) => void;
    getKey: (key: string) => any;
    changeLanguage: (key: any) => void;
    values: any;
    repeatDone: () => void;
    resourceFetcher: (url: string) => any;
    resourcePusher: (url: string, data: any) => any;
    scrollToTop: (whoseScroll: string) => void;
}

var fastorzControllers = angular.module('fastorzControllers', []);

fastorzControllers.controller('FastORZCtrl', ['$scope', '$translate', '$http', '$q', '$filter', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', function($scope: IFastORZScope, $translate: angular.translate.ITranslateService, $http: ng.IHttpService, $q: ng.IQService, $filter: ng.IFilterService, $window: ng.IWindowService, $ionicSlideBoxDelegate: ionic.slideBox.IonicSlideBoxDelegate, $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate){
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){});
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {});

    $scope.changeLanguage = (key: any) => {
        $translate.use(key);
    };
    
    $scope.values = {}
    
    $scope.setKey = (key: string, value: any) => {
		if (value === undefined) {
			delete $scope.values[key];
		} else {
			$scope.values[key] = value;
		}
	};
    
    $scope.getKey = (key: string) => {
		return $scope.values[key];
    };
    
    $scope.repeatDone = () => {
        $ionicSlideBoxDelegate.update();
    }
  
    $scope.resourceFetcher = (url: string) => {
        var d = $q.defer();
        var p = $http({
                url: url,
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
			.success((data: any) => {
				d.resolve(data);
			})
			.error((err: any) => {
				d.reject(err);
			});
		return d.promise;
    }

    $scope.resourcePusher = (url: string, data: any) => {
        var d = $q.defer();
        var p = $http({
                url: url,
                method:"POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            })
            .success((res: any) => {
                d.resolve(res);
            }).
            error((err: any) => {
                d.reject(err);
            });
        return d.promise;
    };

    $scope.scrollToTop = (whoseScroll: string) => {
        $ionicScrollDelegate.$getByHandle(whoseScroll).scrollTop();
    }
}]);

declare function escape(string: string): string;

declare function unescape(string: string): string;

interface Date {
    toGMTString(): string;
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
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















