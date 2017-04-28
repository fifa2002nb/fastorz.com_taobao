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
    personalData : any;
    pointsPopup: () => void;
    ordersPopup: () => void;
    addOrderPopup: () => void;
    cleanPointsPopup: () => void;
    showRules: () => void;
    refreshOrders: () => void;
    currUser: any;
    loginOrder: () => void;
}

fastorzControllers.controller('BaseCtrl', ['$scope', '$state', '$timeout', '$sce', '$q', '$http', '$ionicPopup', '$window', '$ionicTabsDelegate', function($scope: IBaseScope, $state: angular.ui.IStateService, $timeout: angular.ITimeoutService, $sce: angular.ISCEService, $q: ng.IQService, $http: ng.IHttpService, $ionicPopup: ionic.popup.IonicPopupService, $window: angular.IWindowService, $ionicTabsDelegate: ionic.tabs.IonicTabsDelegate){
    $scope.productItems = [];
    $scope.productSearch = {searchKey: "", searching: false, searchLimit: 12, searchType: Math.round(Math.random() * 30)};
    $scope.productBase = 0;
    $scope.productNoMoreData = false;
    $scope.darenItems = [];
    $scope.darenSearch = {searchKey: "", searching: false, searchLimit: 12, searchType: Math.round(Math.random() * 30)};
    $scope.darenBase = 0;
    $scope.darenNoMoreData = false;
    $scope.darenStatus = {showDetail: false, currDaren: null};
    $scope.tmallIcon = "http://auz.qnl1.com/open/quan/images/taobao.png"
    $scope.personalData = {orders: null};       
    $scope.currUser = {openID: null, state: null, isAdmin: false, orders: null, shippedCount: -1, shippedPoints: -1, payingCount: -1, payingPoints: -1, paidCount: -1, paidPoints: -1, submitOrderNumber: null, msg: "", alipayAccount: null, shippedCash: -1};
    $scope.currUser.openID = angular.element('#openID').attr("alt");
    $scope.currUser.state = angular.element('#state').attr("alt");

    $scope.refreshOrders = () => {
        var data = {openID: $scope.currUser.openID};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/searchorders", data)
            .then((res: any) => {
                if(0 == res.code && res.result) {
                    $scope.currUser.orders = res.result.orders;
                    $scope.currUser.shippedCount = res.result.shippedCount;
                    $scope.currUser.shippedPoints = res.result.shippedPoints;
                    $scope.currUser.shippedCash = (res.result.shippedPoints /100).toFixed(1);
                    $scope.currUser.payingCount = res.result.payingCount;
                    $scope.currUser.payingPoints = res.result.payingPoints;
                    $scope.currUser.paidCount = res.result.paidCount;
                    $scope.currUser.paidPoints = res.result.paidPoints;
                } else {
                    console.log(res);
                }
            }, (err: any) => {
                console.log(err);
            });
    }
    $scope.loginOrder = () => {
        var data = {openID: $scope.currUser.openID};
        $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/godlogin", data)
            .then((res: any) => {
                if(0 == res.code) {
                    $scope.currUser.alipayAccount = res.result.alipayAccount;
                    $scope.refreshOrders();
                } else {
                    console.log(res);
                }
            }, (err: any) => {
                console.log(err);
            });
    } 

    if ("" != $scope.currUser.openID) {
        $scope.loginOrder();
        if ("oSQ8KtyQHjsiVzt5rSM_LWmDYiyw" == $scope.currUser.openID || "oSQ8Kt2_bfXWt5lcea-NcRmb4sfA" == $scope.currUser.openID || "oSQ8Kt_RWX1VuVt8OZUHuRzny-0s" == $scope.currUser.openID || "oSQ8Kt3oAEu6cw-HQp-Qwue0OV7M" == $scope.currUser.openID) {
            $scope.currUser.isAdmin = true;
        }
    }

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
                template: '<div style="font-size:16px;text-align:center;">请打开【手机淘宝APP】领券下单。</div>',
                title: '已复制淘口令',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>知道了</b>',
                        type: 'button-assertive',
                    }
                ]
            });
        } else {
            $window.open(quan);
        }
    }

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
        $scope.scrollToTop("darenDetailScroll");
        $scope.darenStatus.showDetail = true;
        $scope.darenStatus.currDaren = null;
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
    $scope.pointsPopup = () => {
        $scope.refreshOrders();
        var myPopup = $ionicPopup.show({
            templateUrl: GLOBAL_CONFIG.nowTemplateUrlBase + 'points.html', 
            title: '积分详情',
            scope: $scope,
            buttons: [
                {
                    text: '<b>确定</b>',
                    type: 'button-assertive',
                },
            ]
        });
    }
    $scope.ordersPopup = () => {
        $scope.refreshOrders();
        var myPopup = $ionicPopup.show({
            templateUrl: GLOBAL_CONFIG.nowTemplateUrlBase + 'orders.html', 
            title: '积分详情',
            scope: $scope,
            buttons: [
                {
                    text: '<b>确定</b>',
                    type: 'button-assertive',
                },
            ]
        });
    }
    $scope.addOrderPopup = () => {
        $scope.currUser.submitOrderNumber =  "";
        $scope.currUser.msg = "";
        var hint = "输入有效订单号。";
        var successHint = "提交成功。";
        var failHint = "提交失败。";
        var serverErrHint = "服务器故障。";
        var myPopup = $ionicPopup.show({
            template: '<div style="font-size:16px;text-align:center;">请在此输入【淘宝APP】下单后的购物订单号。订单号样例：10157050315078885。</div><br/><input type="text" ng-model="currUser.submitOrderNumber" style="text-align: center;"><br/><div style="font-size:16px;text-align:center;color:#eb4e53;">{{currUser.msg}}</div>', 
            title: '淘宝订单登记',
            scope: $scope,
            buttons: [
                {
                    text: '<b>提交</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        if ("" == $scope.currUser.submitOrderNumber) {
                            $scope.currUser.msg = hint;
                        } else {
                            var myreg = /[0-9]{10,30}/;  
                            if(!myreg.test($scope.currUser.submitOrderNumber)) {
                                $scope.currUser.msg = hint; 
                            } else {
                                var data = {openID: $scope.currUser.openID, orderNumber: $scope.currUser.submitOrderNumber};
                                $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/submitorder", data)
                                    .then((res: any) => {
                                        if(0 == res.code) {
                                            $scope.currUser.msg = successHint;
                                        } else {
                                            $scope.currUser.msg = failHint;
                                        }
                                    }, (err: any) => {
                                        $scope.currUser.msg = serverErrHint;
                                    });
                            }
                        }
                        e.preventDefault();
                    }
                },
                {
                    text: '<b>关闭</b>',
                    type: 'button-normal',
                },
            ],
        });
    }
    $scope.showRules = () => {
        var myPopup = $ionicPopup.show({
            template: '<div style="font-size:16px;text-align:center;">100积分 = 1元人民币</div>', 
            title: '积分变现规则',
            scope: $scope,
            buttons: [
                {
                    text: '<b>知道了</b>',
                    type: 'button-assertive',
                }
            ],
        });
    }

    $scope.cleanPointsPopup = () => {
        $scope.refreshOrders();
        $scope.currUser.msg = "";
        var accountHint = "请输入有效【支付宝】账号，比如：xysmiracle@gmail.com。";
        var successHint = "提交成功。";
        var failHint = "提交失败。";
        var serverErrHint = "服务器故障。";
        var myPopup = $ionicPopup.show({
            templateUrl: GLOBAL_CONFIG.nowTemplateUrlBase + 'points_clean.html',
            title: '积分提现',
            scope: $scope,
            buttons: [
                {
                    text: '<b>提交</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        if ("" == $scope.personalData.alipayAccount) {
                            $scope.currUser.msg = accountHint;
                            e.preventDefault();
                        } else {
                            var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                            if(!reg.test($scope.currUser.alipayAccount)) {
                                $scope.currUser.msg = accountHint;
                                e.preventDefault();
                            } else {
                                var data = {openID: $scope.currUser.openID, alipayAccount: $scope.currUser.alipayAccount};
                                $scope.resourcePusher(GLOBAL_CONFIG.nowCMSBase + "v1/payorders", data)
                                    .then((res: any) => {
                                        if(0 == res.code) {
                                            $scope.currUser.msg = successHint;
                                        } else {
                                            $scope.currUser.msg = failHint;
                                        }
                                    }, (err: any) => {
                                        $scope.currUser.msg = serverErrHint;
                                    });
                                e.preventDefault();    
                            }
                        }
                    }
                },
                {
                    text: '<b>关闭</b>',
                    type: 'button-normal',
                },
            ],
        });
    }
    $scope.productDoRefresh(false);
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if('' != $scope.currUser.openID) {
            angular.element("body > ui-view > ion-tabs > div.tab-nav.tabs > a:nth-child(8)").remove();
            if('userCenter' == $scope.currUser.state) {
                $ionicTabsDelegate.$getByHandle("fastTabs").select(2);
            } else if('dailyProducts' == $scope.currUser.state) {
                $ionicTabsDelegate.$getByHandle("fastTabs").select(0);
            } else {
                $ionicTabsDelegate.$getByHandle("fastTabs").select(1);    
            }
        } else {
            angular.element("body > ui-view > ion-tabs > div.tab-nav.tabs > a:nth-child(7)").remove();
        }
    });
}]);
