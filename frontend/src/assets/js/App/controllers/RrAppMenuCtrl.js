angular.module('RrAppMenuCtrl', ['ngStorage'])
    .controller('MenuCtrl', function ($scope, $http, $localStorage, updateProfileService) {

        var neuro = io.connect('http://localhost:9002/neuro');

        neuro.on('auth', function(){
            neuro.emit('auth', {token: $localStorage.token});
        })

        neuro.on('trigger', function(data){
            console.log(data);
            $('.thingModal.voice').modal('show');//todo open + start listener
        });

        $scope.isAuth = $localStorage.token != null && $localStorage.username != null ? true : false;
        $scope.username = $localStorage.username != null ? $localStorage.username : '';


        updateProfileService.getPromise().then(function (a) {


            a.$on('update-profile', function(){
                neuro.connect().emit('auth', {token: $localStorage.token});
                $scope.isAuth = $localStorage.token != null && $localStorage.username != null ? true : false;
                $scope.username = $localStorage.username != null ? $localStorage.username : '';
            });

        })


    })