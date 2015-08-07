angular.module('RrAppThingsAddCtrl', [])
    .controller('thingsAddCtrl', function ($scope, fetchService, updateProfileService, $http, $localStorage, $location, $route) {

        var self = $scope;
        self.chosenThing = -1;
        self.connectedThings = [];


        fetchService.getConnectedThings().then(function (data) {
            self.connectedThings = data.data;
        });


        self.add = function (path) {
            if (self.chosenThing == -1)
                return alert('choose thing first!');

            $http.post('http://localhost:9000/rest-things-add', {
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