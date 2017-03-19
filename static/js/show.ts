class showItem {
    Title: string;
    Image: string;
    MarketPrice: number;
    DiscountPrice: number;
    SavePrice: number;
    SellNum: number;
    Quan: string;
}

interface IShowScope extends IFastORZScope {
    base: number;
    noMoreData: boolean;
    items: showItem[];
    search: any;
    doRefresh: () => void;
    loadMore: () => void;
    showPopup: () => void;
    data: any;
}

fastorzControllers.controller('ShowCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', function($scope: IShowScope, $state: angular.ui.IStateService, $timeout: angular.ITimeoutService, $sce: angular.ISCEService, $q: ng.IQService, $http: ng.IHttpService, $ionicPopup: ionic.popup.IonicPopupService){
    $scope.items = [];
    $scope.search = {searchKey: null, searching: false};
    $scope.base = 0;
    $scope.noMoreData = false;

    var fakeItems = []; 
    for(var i = 0; i < 100; i++) {
        fakeItems.push({Title: "aaaa" + i, Image: "http://image.taobao.com/bao/uploaded/i4/TB1BpdNPFXXXXaPXpXXXXXXXXXX_!!2-item_pic.png", MarketPrice: 999.5 + i, DiscountPrice: 555.2 + i, SavePrice: 999.5-555.5, SellNum: 567 + i, Quan: "zzzzz" + i})
    }

    $scope.doRefresh = () => {
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
    }

    $scope.loadMore = () => {
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
    }

    $scope.showPopup = function() {
        $scope.data = {}
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

    $scope.doRefresh();
}]);
