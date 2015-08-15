angular.module('RrAppConfigureManageCtrl', [])
    .controller('configureManageCtrl', function ($scope, fetchService, updateProfileService, $http, $localStorage, $location) {

        var self = $scope;
        self.chosenCommand = -1;
        self.connectedThings = [];


        fetchService.getConnectedThings().then(function (data) {
            self.connectedThings = data.data;
        });


        self.remove = function (path) {
            if (self.chosenThing == -1)
                return alert('choose thing first!');

            $http.post('http://localhost:9000/rest-things-remove', {//todo implement
                thing: self.connectedThings[self.chosenThing],
                token: $localStorage.token
            })
                .success(function (message) {
                    alert(message)
                    location.reload();
                });

        }



        self.back = function(path){
            $location.path( path );
        }


        updateProfileService.getPromise().then(function (a) {

            // a.$$listeners['update-profile'].pop();
            a.$on('update-profile', function () {
                console.log("!!!");
                fetchService.getConnectedThings().then(function (data) {
                    self.connectedThings = data.data;
                });

            });
        })

    });