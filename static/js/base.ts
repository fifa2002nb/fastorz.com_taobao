class productItem {
    title:          string;
    image:          string;
    market_price:   number;
    discount_price: number;
    save_price:     number;
    sell_num:       number;
    quan:           string;
}

class darenItem {
    id:         number;
    title:      string;
    image:      string;
    content:    string;
}

interface IBaseScope extends IFastORZScope {
    deviceType: string;
    productNoMoreData: boolean;
    productBase: number;
    productItems: productItem[];
    productSearch: any;
    productDoRefresh: (searching: boolean) => void;
    productLoadMore: () => void;
    productShowPopup: (quan: string) => void;
    darenStatus: any;
    darenNoMoreData: boolean;
    darenBase: number;
    darenItems: darenItem[];
    darenSearch: any;
    darenDoRefresh: (searching: boolean) => void;
    darenLoadMore: () => void;
    darenDetail: (id: number) => void;
    tmallIcon: string;
}

fastorzControllers.controller('BaseCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', '$window', function($scope: IBaseScope, $state: angular.ui.IStateService, $timeout: angular.ITimeoutService, $sce: angular.ISCEService, $q: ng.IQService, $http: ng.IHttpService, $ionicPopup: ionic.popup.IonicPopupService, $window: angular.IWindowService){
    $scope.productItems = [];
    $scope.productSearch = {searchKey: "", searching: false, searchLimit: 20, searchType: Math.round(Math.random() * 30)};
    $scope.productBase = 0;
    $scope.productNoMoreData = false;
    $scope.darenItems = [];
    $scope.darenSearch = {searchKey: "", searching: false, searchLimit: 20, searchType: Math.round(Math.random() * 30)};
    $scope.darenBase = 0;
    $scope.darenNoMoreData = false;
    $scope.darenStatus = {showDetail: false, currDaren: null};
    $scope.tmallIcon = "http://auz.qnl1.com/open/quan/images/taobao.png"
    
    if (/(iPhone|iPad|iPod|iOS)/i.test($window.navigator.userAgent)) {
        $scope.deviceType = "ios";
    } else if (/(Android)/i.test($window.navigator.userAgent)) {
        $scope.deviceType = "android";
    } else {
        $scope.deviceType = "pc";
    };
    new Clipboard('.quan-btn');
    
    $scope.productDoRefresh = (searching: boolean) => {
        if(!searching) {
            $scope.productSearch.searchType = Math.round(Math.random() * 30);
        }
        $scope.productNoMoreData = false;
        $scope.productSearch.searching = searching;
        $scope.productBase = 0;
        var data = {key: $scope.productSearch.searchKey, type: $scope.productSearch.searchType, base: $scope.productBase, limit: $scope.productSearch.searchLimit, device: $scope.deviceType};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
            .then((res: any) => {
                if(0 == res.code) {
                    $scope.productItems = res.result;
                    if($scope.productSearch.searchLimit > $scope.productItems.length) {
                        $scope.productNoMoreData = true;
                    }
                } else {
                    console.log(res.result);
                }
                $scope.productBase = 1;
                $scope.$broadcast("scroll.refreshComplete");
                $scope.productSearch.searching = false;
            }, (err: any) => {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.productSearch.searching = false;
            });
    }
    
    $scope.productLoadMore = () => {
        $scope.productNoMoreData = false;
        var data = {key: $scope.productSearch.searchKey, type: $scope.productSearch.searchType, base: $scope.productBase, limit: $scope.productSearch.searchLimit, device: $scope.deviceType};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
            .then((res: any) => {
                if(0 == res.code) {
                    if($scope.productSearch.searchLimit > res.result.length) {
                        $scope.productNoMoreData = true;
                    }
                    for(var i = 0; i < res.result.length; i++) {
                        $scope.productItems.push(res.result[i]);
                    }
                }
                $scope.productBase++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }, (err: any) => {
                $scope.$broadcast("scroll.infiniteScrollComplete")
            });
    }
    
    $scope.productShowPopup = (quan: string) => {
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

    $scope.productDoRefresh(false);

    $scope.darenDoRefresh = (searching: boolean) => {
        if(!searching) {
            $scope.darenSearch.searchType = Math.round(Math.random() * 30);
        }
        $scope.darenStatus.showDetail = false;
        $scope.darenNoMoreData = false;
        $scope.darenSearch.searching = searching;
        $scope.darenBase = 0;
        var data = {key: $scope.darenSearch.searchKey, type: $scope.darenSearch.searchType, base: $scope.darenBase, limit: $scope.darenSearch.searchLimit, device: $scope.deviceType};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/darens", data)
            .then((res: any) => {
                if(0 == res.code) {
                    $scope.darenItems = res.result;
                    if($scope.darenSearch.searchLimit > $scope.darenItems.length) {
                        $scope.darenNoMoreData = true;
                    }
                } else {
                    console.log(res.result);
                }
                $scope.darenBase = 1;
                $scope.$broadcast("scroll.refreshComplete");
                $scope.darenSearch.searching = false;
            }, (err: any) => {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.darenSearch.searching = false;
            });
    }
    
    $scope.darenLoadMore = () => {
        $scope.darenStatus.showDetail = false;
        $scope.darenNoMoreData = false;
        var data = {key: $scope.darenSearch.searchKey, type: $scope.darenSearch.searchType, base: $scope.darenBase, limit: $scope.darenSearch.searchLimit, device: $scope.deviceType};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/darens", data)
            .then((res: any) => {
                if(0 == res.code) {
                    if($scope.darenSearch.searchLimit > res.result.length) {
                        $scope.darenNoMoreData = true;
                    }
                    for(var i = 0; i < res.result.length; i++) {
                        $scope.darenItems.push(res.result[i]);
                    }
                }
                $scope.darenBase++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }, (err: any) => {
                $scope.$broadcast("scroll.infiniteScrollComplete")
            });
    }

    $scope.darenDetail = (id: number) => {
        $scope.darenStatus.showDetail = true;
        $scope.resourceFetcher(GLOBAL_CONFIG.nowCMSBase + "v1/daren?id=" + id)
            .then((res: any) => {
                if(0 == res.code) {
                    $scope.darenStatus.currDaren = res.result;
                } else {
                    console.log(res);
                }
            }, (err: any) => {
                console.log(err)
            });
    }
}]);
