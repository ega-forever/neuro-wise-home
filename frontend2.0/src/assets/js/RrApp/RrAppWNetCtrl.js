angular.module('RrAppWNetCtrl', [])
    .controller('wNetCtrl', function (JsxWnetFactory, $scope, restService, $localStorage) {
        var _this = $scope;

        JsxWnetFactory.WNetRender({attention: 0, meditation: 0}, _this);


        var neuro =  io.connect('http://localhost:9003/neuro');
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

            if(payload.data.meditation > 70 && payload.data.attention > 70){
                angular.element(document.getElementById('voice-record')).scope().execute();
            }
        });

    });