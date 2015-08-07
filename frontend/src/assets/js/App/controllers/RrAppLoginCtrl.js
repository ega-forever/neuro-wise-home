angular.module('RrAppLoginCtrl', ['ngStorage'])
    .controller('LoginCtrl', function ($scope, $http, $localStorage, updateProfileService) {
        $scope.username = $localStorage.username === null ? '' : $localStorage.username;
        $scope.password = '';
        $scope.isAuth = $localStorage.token != null && $localStorage.username != null ? true : false;


        updateProfileService.getDeferred().resolve($scope);//pass scope to other controllers

        $scope.login = function () {
            return $http.post('http://localhost:9000/authenticate', {name: $scope.username, password: $scope.password}).
                success(function (data, status, headers, config) {

                    if(!data.success)//todo toaster about fail auth
                    return alert(data.message)

                    $localStorage.token = data.token;
                    $localStorage.username = data.username;

                    $scope.isAuth = true;

                    $scope.$emit('update-profile', []);

                    $('.authModal').modal('hide');
                })
        }

        $scope.logout = function () {

            $scope.username = '';
            $scope.password = '';
            $scope.isAuth = false;
            $localStorage.$reset();
            $scope.$emit('update-profile', []);
            $('.authModal').modal('hide');

        }
    })