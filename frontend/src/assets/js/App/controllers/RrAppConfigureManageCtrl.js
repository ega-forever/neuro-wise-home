angular.module('RrAppConfigureManageCtrl', [])
    .controller('configureManageCtrl', function ($scope, fetchService, updateProfileService, $http, $localStorage, $location) {

        var self = $scope;
        self.commands = [];


        fetchService.getCommands().then(function (data) {
            console.log(JSON.parse(data.data[0].classifier));
            data.data.map(function (a) {
                a.classifier = JSON.parse(a.classifier);
                a.classifier.docs.map(function (d) {
                    console.log(d);
                    if (d.text.join) {
                        d.text = d.text.join(' ').replace(a.point,'').trim();
                    }

                })


            });
            self.commands = data.data;
        });


        self.modify = function (command) {
            console.log(command);
            command.classifier.docs.map(function(d){
                d.text = d.text.split(' ');
                d.text.push(command.point);
            });
            command.classifier = JSON.stringify(command.classifier);
            $http.post('http://localhost:9000/rest-command-modify', {//todo implement
                command: command,
                token: $localStorage.token
            })
                .success(function (message) {
                    alert(message);
                    $location.path('/things');
                    location.reload();
                });

        };

        self.remove = function (command) {

            $http.post('http://localhost:9000/rest-command-remove', {//todo implement
                command: command,
                token: $localStorage.token
            })
                .success(function (message) {
                    //alert(message)
                    //location.reload();
                    _.pull(self.commands, command);
                    self.$apply();
                });

        };


        self.back = function (path) {
            $location.path(path);
        }

        /*
         updateProfileService.getPromise().then(function (a) {

         // a.$$listeners['update-profile'].pop();
         a.$on('update-profile', function () {
         console.log("!!!");
         fetchService.getConnectedThings().then(function (data) {
         self.connectedThings = data.data;
         });

         });
         })
         */
    });