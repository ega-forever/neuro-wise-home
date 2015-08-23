angular.module('RrAppConfigureManageCtrl', [])
    .controller('configureManageCtrl', function ($scope, fetchService, updateProfileService, $http, $localStorage, $location) {

        var self = $scope;
        self.commands = [];

        self.availableCommands = [];


        self.setComAction = function (Pindex, index, action) {
            self.commands[Pindex].classifier[index].action = action;
            console.log(self.commands[Pindex]);
        }

        fetchService.getCommands().then(function (data) {
            console.log(data.data[0].classifier);
            data.data.map(function (a) {

                fetchService.getThings().then(function (c) {
                    console.log(c.data);
                    //console.log(c.data[0].controller.commands);
                    c.data.forEach(function (s) {
                        s.controller.commands = _.map(s.controller.commands, function (n) {
                            return s.thingType + " - " + n;
                        });
                        console.log(s.controller.commands);
                        self.availableCommands.push(s.controller.commands);
                    })
                });
            });
            //data.data.push({classifier: {docs: [{label: 'omega', text: 'super'}]}});//todo for tests
            //self.availableCommands.push(_.pluck(data.data[1].classifier.docs, 'label'));//todo for tests
console.log(data.data);
            self.commands = data.data;
        });


        self.modify = function (command) {
            console.log(command);
           /* command.classifier.map(function (d) {
                d.pattern = d.pattern.split(' ');
                d.pattern.push(command.point);
            });
            console.log(command);*/


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


    });