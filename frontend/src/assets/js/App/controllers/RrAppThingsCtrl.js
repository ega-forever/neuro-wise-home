var m = [];
angular.module('RrAppThingsCtrl', [])
    .controller('thingsCtrl', function ($scope, $http, fetchService, $localStorage,
                                        updateProfileService, thingsData, $route, thingsEvents) {

        var self = $scope;
        self.things = [];


        self.things = thingsData.data.map(function (thing) {
            //for (var i = 0; i < thingsData.data.length; i++) {
            console.log(thing);
            m.push(thing);
            thing.io = io(thing.io);
            thing.io.on('message', function (payload) {
                console.log('  Event:', payload.event);

                console.log(thing);
                // console.log(thing.thingType);
                // console.log(thingsEvents.events[thing.thingType]);
                if (thingsEvents.events[thing.thingType][payload.event] != null)
                    thingsEvents.events[thing.thingType][payload.event](thing, payload.data);


                thing.disabled = false;
                self.$apply()
            });

            thing.io.emit("grid");

            thing.toggleIo = function () {
                console.log(this);
                this.disabled = false;
                console.log($localStorage.token);
                this.io.emit('toggle', {token: $localStorage.token});

            };
            return thing;
        });


        self.clearThings = function () {
            for (var s = 0; s < self.things.length; s++) {
                self.things[s].io.io.disconnect();
                self.things[s].io.destroy();

            }
            self.things = [];
        }


        self.getConnectedThings = function () {
            return fetchService.getConnectedThings().success(function (data) {
                console.log(data);
                self.connectedThings = data;
            })

        }


        updateProfileService.getPromise().then(function (a) {


            a.$$listeners['update-profile'].pop();
            a.$on('update-profile', function () {
                console.log($localStorage);
                if ($localStorage.token == null)
                    self.clearThings();
                $route.reload();
            });
        })


    })