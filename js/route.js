// 创建angular路由模块,使用angular路由需要注入依赖angular原生模块ngRoute
angular.module('movieApp.route', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        // 配置路由
        $routeProvider.when('/', { //首页
                templateUrl: 'tmps/index-tmp.html'
            })
            .when('/nowplaying', {
                templateUrl: 'tmps/nowplaying-tmp.html',
                controller:'nowplayingCtrl'
            })
            .when('/later', {
                templateUrl: 'tmps/later-tmp.html',
                controller:'laterCtrl'
            })
            .when('/top250', {
                templateUrl: 'tmps/top250-tmp.html',
                controller:'top250Ctrl'
            })
    }]);
