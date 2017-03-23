class showItem {
    title: string;
    image: string;
    market_price: number;
    discount_price: number;
    save_price: number;
    sell_num: number;
    quan: string;
}

interface IShowScope extends IFastORZScope {
    base: number;
    noMoreData: boolean;
    items: showItem[];
    search: any;
    doRefresh: (searching: boolean) => void;
    loadMore: () => void;
    showPopup: () => void;
}

fastorzControllers.controller('ShowCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', function($scope: IShowScope, $state: angular.ui.IStateService, $timeout: angular.ITimeoutService, $sce: angular.ISCEService, $q: ng.IQService, $http: ng.IHttpService, $ionicPopup: ionic.popup.IonicPopupService){
    $scope.items = [];
    $scope.search = {searchKey: "", searching: false, searchLimit: 20};
    $scope.base = 0;
    $scope.noMoreData = false;
    
    new Clipboard('.quan-btn');
    
    $scope.doRefresh = (searching: boolean) => {
        $scope.noMoreData = false;
        $scope.search.searching = searching;
        $scope.base = 0;
        var data = {key: $scope.search.searchKey, base: $scope.base, limit: $scope.search.searchLimit};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
            .then((res: any) => {
                if(0 == res.code) {
                    $scope.items = res.result;
                    if(20 > $scope.items.length) {
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
        var data = {key: $scope.search.searchKey, base: $scope.base, limit: $scope.search.searchLimit};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/search", data)
            .then((res: any) => {
                if(0 == res.code) {
                    if(20 > res.result.length) {
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
    
    $scope.showPopup = function() {
        var myPopup = $ionicPopup.show({
            template: '<div style="text-align: center;">请打开手机淘宝APP领券下单。</div>',
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
    }

    $scope.doRefresh(false);
}]);
