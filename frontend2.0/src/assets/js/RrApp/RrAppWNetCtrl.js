angular.module('RrAppWNetCtrl', [])
    .controller('wNetCtrl', function (JsxWnetFactory, $scope, restService, $localStorage, socketService) {
        var _this = $scope;

        JsxWnetFactory.WNetRender({attention: 0, meditation: 0}, _this);


        var neuro =  socketService.getNeuroIo();
        neuro.on('auth', function(){
            neuro.emit('auth', {token: $localStorage.token});
            console.log('in auth');
        });

        neuro.on('payload', function(payload){
            //payload.data.attention += "%";
            //payload.data.meditation += "%";
            //_this.data = payload.data;
            JsxWnetFactory.WNetRender(payload.data, _this);

            console.log(payload.data);

            if(payload.data.meditation > 60 && payload.data.attention > 60){
                angular.element(document.getElementById('voice-record')).scope().execute();
            }
        });

    });