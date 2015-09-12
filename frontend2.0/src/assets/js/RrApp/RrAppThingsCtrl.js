angular.module('RrAppThingsCtrl', [])
    .controller('thingsCtrl', function (JsxThingsFactory, $scope, restService, $localStorage) {
        var _this = $scope;
        // var data = [{name: 'super!!!', id: 1237}, {name: 'super2', id : 54}];//test


        var socket = io('http://localhost:9002/auth');
        if ($localStorage.token) {
            socket.emit('authIo', {token: $localStorage.token});
            socket.on('ok', function () {
                console.log('authed...');
                restService.getThings().then(function (d) {
                    console.log(d);

                    var testThingsSuper = io('http://localhost:9001/api/robots/super');
                    testThingsSuper.emit('toggle');

                    testThingsSuper.on('change', function(d){
                        console.log('changed: ' + d);
                    });

                    JsxThingsFactory.thingsRender(d.data, _this);
                })
            });
        } else {
            JsxThingsFactory.thingsRender([], _this);
        }


        _this.AttachThing = function () {
            alert('super');
        }

    });