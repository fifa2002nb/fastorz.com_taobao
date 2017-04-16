class baseItem {
    title: string;
    image: string;
    market_price: number;
    discount_price: number;
    save_price: number;
    sell_num: number;
    quan: string;
}

interface IBaseScope extends IFastORZScope {
    deviceType: string;
    base: number;
    noMoreData: boolean;
    items: baseItem[];
    search: any;
    doRefresh: (searching: boolean) => void;
    loadMore: () => void;
    showPopup: (quan: string) => void;
<<<<<<< HEAD:static/js/base.ts
    daren: any;
=======
    tmallIcon: string;
>>>>>>> cd9f0a640ad760310564bfd71d842e900f6c8e92:static/js/show.ts
}

fastorzControllers.controller('BaseCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', '$window', function($scope: IBaseScope, $state: angular.ui.IStateService, $timeout: angular.ITimeoutService, $sce: angular.ISCEService, $q: ng.IQService, $http: ng.IHttpService, $ionicPopup: ionic.popup.IonicPopupService, $window: angular.IWindowService){
    $scope.items = [];
    $scope.search = {searchKey: "", searching: false, searchLimit: 20, searchType: Math.round(Math.random() * 30)};
    $scope.base = 0;
    $scope.noMoreData = false;
<<<<<<< HEAD:static/js/base.ts
    $scope.daren = {showDetal: false};
=======
    $scope.tmallIcon = "http://auz.qnl1.com/open/quan/images/taobao.png"
>>>>>>> cd9f0a640ad760310564bfd71d842e900f6c8e92:static/js/show.ts
    
    if (/(iPhone|iPad|iPod|iOS)/i.test($window.navigator.userAgent)) {
        $scope.deviceType = "ios";
    } else if (/(Android)/i.test($window.navigator.userAgent)) {
        $scope.deviceType = "android";
    } else {
        $scope.deviceType = "pc";
    };
    new Clipboard('.quan-btn');
    
    $scope.doRefresh = (searching: boolean) => {
        if(!searching) {
            $scope.search.searchType = Math.round(Math.random() * 30);
        }
        $scope.noMoreData = false;
        $scope.search.searching = searching;
        $scope.base = 0;
        var data = {key: $scope.search.searchKey, type: $scope.search.searchType, base: $scope.base, limit: $scope.search.searchLimit, device: $scope.deviceType};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
            .then((res: any) => {
                if(0 == res.code) {
                    $scope.items = res.result;
                    if($scope.search.searchLimit > $scope.items.length) {
                        $scope.noMoreData = true;
                    }
                } else {
                    console.log(res.result);
                }
                $scope.base = 1;
                $scope.$broadcast("scroll.refreshComplete");
                $scope.search.searching = false;
            }, (err: any) => {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.search.searching = false;
            });
    }
    
    $scope.loadMore = () => {
        $scope.noMoreData = false;
        var data = {key: $scope.search.searchKey, type: $scope.search.searchType, base: $scope.base, limit: $scope.search.searchLimit, device: $scope.deviceType};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
            .then((res: any) => {
                if(0 == res.code) {
                    if($scope.search.searchLimit > res.result.length) {
                        $scope.noMoreData = true;
                    }
                    for(var i = 0; i < res.result.length; i++) {
                        $scope.items.push(res.result[i]);
                    }
                }
                $scope.base++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }, (err: any) => {
                $scope.$broadcast("scroll.infiniteScrollComplete")
            });
    }
    
    $scope.showPopup = (quan: string) => {
        if("pc" != $scope.deviceType) {
            var myPopup = $ionicPopup.show({
                template: '<div style="text-align: center;">请打开【手机淘宝APP】领券下单。</div>',
                title: '已复制淘口令',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>知道了</b>',
                        type: 'button-stable',
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
                });
        } else {
            $window.open(quan);
        }
    }

    $scope.doRefresh(false);
}]);
