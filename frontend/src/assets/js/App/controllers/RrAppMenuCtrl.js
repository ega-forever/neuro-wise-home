angular.module('RrAppMenuCtrl', ['ngStorage'])
    .controller('MenuCtrl', function ($scope, $http, $localStorage, updateProfileService) {


        $scope.isAuth = $localStorage.token != null && $localStorage.username != null ? true : false;
        $scope.username = $localStorage.username != null ? $localStorage.username : '';


        updateProfileService.getPromise().then(function (a) {


            a.$on('update-profile', function(){
                $scope.isAuth = $localStorage.token != null && $localStorage.username != null ? true : false;
                $scope.username = $localStorage.username != null ? $localStorage.username : '';
            });

        })


    })