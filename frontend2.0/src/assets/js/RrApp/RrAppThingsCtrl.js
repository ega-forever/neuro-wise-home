angular.module('RrAppThingsCtrl', [])
    .controller('thingsCtrl', function (JsxThingsFactory, $scope, restService, $localStorage, voiceStorageService,socketService) {
        var _this = $scope;
        var socket = socketService.getAuthIo();

            socket.on('ok', function () {
                console.log('authed...');
                restService.getThings().then(function (d) {
                    console.log(d);
                    voiceStorageService.setThings(d.data);

                    d.data.map(function (th) {
                        th.socketObj = {io: socketService.getThingIo(th.name)};
                    })

                    JsxThingsFactory.thingsRender(d.data, _this);
                })
            });

        if ($localStorage.token == null) {
            JsxThingsFactory.thingsRender([], _this);
        }


        socket.emit('authIo', {token: $localStorage.token});

        _this.AttachThing = function () {
            alert('super');
        }


        _this.SaveVoiceThing = function (thing, voice) {
            console.log(voice);
            var deferred = Q.defer();

            restService.updateVoiceCommand(voice, thing).then(function (i) {
                console.log(i);
                deferred.resolve(true);
            });
            return deferred.promise;
        }

        _this.ChangeOption = function (thing, option, newState) {
            thing.io.once('change', function (d) {
                socket.emit('authIo', {token: $localStorage.token});
                //location.reload();
            });
            thing.io.emit(option.replace("State", ""));
        }

    });