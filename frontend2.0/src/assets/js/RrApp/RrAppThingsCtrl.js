angular.module('RrAppThingsCtrl', [])
    .controller('thingsCtrl', function (JsxThingsFactory, $scope, restService, $localStorage, voiceStorageService) {
        var _this = $scope;
        // var data = [{name: 'super!!!', id: 1237}, {name: 'super2', id : 54}];//test
        var socket = io('http://localhost:9002/auth');//todo pass to socket factory for auth login-logout handle

        if ($localStorage.token) {
            socket.on('ok', function () {
                console.log('authed...');
                restService.getThings().then(function (d) {
                    console.log(d);
                    voiceStorageService.setThings(d.data);

                    d.data.map(function (th) {
                        th.socketObj = {io: io('http://localhost:9001/api/robots/' + th.name)};
                    })

                    JsxThingsFactory.thingsRender(d.data, _this);
                })
            });
        } else {
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