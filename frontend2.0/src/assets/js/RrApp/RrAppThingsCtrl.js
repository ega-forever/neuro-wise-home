angular.module('RrAppThingsCtrl', [])
    .controller('thingsCtrl', function (JsxThingsFactory, $scope, restService, $localStorage) {
        var _this = $scope;
        // var data = [{name: 'super!!!', id: 1237}, {name: 'super2', id : 54}];//test
        var socket = io('http://localhost:9002/auth');

        if ($localStorage.token) {
            socket.on('ok', function () {
                console.log('authed...');
                restService.getThings().then(function (d) {
                    console.log(d);

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

        _this.ChangeOption = function (thing, option, newState) {
            console.log('in change: ' + option);
            console.log(option);
            thing.io.once('change', function (d) {
                console.log('changed');
                socket.emit('authIo', {token: $localStorage.token});
            });
            thing.io.emit(option.replace("State", ""));
        }

    });