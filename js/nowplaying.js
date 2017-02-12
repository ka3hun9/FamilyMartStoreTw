// 创建一个angular控制器模块
angular.module('movieApp.nowplayingCtrl', [])
    .controller('nowplayingCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.name = "张三";
        $scope.movie = {};
        // $http 是angular中的ajax
        $http({
            url: 'data.json'
        }).success(function(data) {
            console.log(data);
            $scope.movie = data;
        })
    }]);
